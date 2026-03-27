#!/usr/bin/env python
import os
import csv
from datetime import datetime, timedelta
from pathlib import Path

from app import create_app
from app.extensions import db
from app.models import (
    Booking,
    BookingStatusLog,
    Maintenance,
    Payment,
    PricingRule,
    Review,
    User,
    Vehicle,
    VehicleCategory,
)


app = create_app()


BODY_STYLE_CATEGORY_MAP = {
    "hatchback": "Economy",
    "sedan": "Comfort",
    "wagon": "SUV",
    "convertible": "Premium",
    "hardtop": "Premium",
}


BODY_STYLE_SEATS_MAP = {
    "convertible": 2,
    "hardtop": 4,
    "hatchback": 5,
    "sedan": 5,
    "wagon": 7,
}


def _resolve_dataset_path() -> Path | None:
    explicit_path = os.getenv("AUTOMOBILE_DATASET_PATH")
    candidates = [
        Path(explicit_path) if explicit_path else None,
        Path(r"d:\VEHICLE!\Automobile_data.csv"),
        Path(__file__).resolve().parent / "Automobile_data.csv",
        Path(__file__).resolve().parent.parent / "Automobile_data.csv",
    ]

    for path in candidates:
        if path and path.exists() and path.is_file():
            return path
    return None


def _safe_float(value, default=0.0):
    if value in (None, "", "?"):
        return float(default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def _safe_int(value, default=0):
    if value in (None, "", "?"):
        return int(default)
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return int(default)


def _default_category_prices() -> dict[str, float]:
    return {
        "Economy": 25.00,
        "Comfort": 45.00,
        "Premium": 75.00,
        "SUV": 60.00,
    }


def _build_categories_from_dataset(dataset_path: Path | None) -> list[VehicleCategory]:
    prices = _default_category_prices()
    if dataset_path is None:
        return [
            VehicleCategory(name=name, description=f"{name} vehicles", base_price_per_hour=price)
            for name, price in prices.items()
        ]

    style_prices: dict[str, list[float]] = {name: [] for name in prices}
    with dataset_path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            body_style = (row.get("body-style") or "").strip().lower()
            category_name = BODY_STYLE_CATEGORY_MAP.get(body_style, "Comfort")
            price = _safe_float(row.get("price"), 0.0)
            if price > 0:
                style_prices[category_name].append(price)

    for category_name, values in style_prices.items():
        if values:
            avg_price = sum(values) / len(values)
            # Convert average market price to a practical hourly rental baseline.
            prices[category_name] = round(max(18.0, min(120.0, avg_price / 700.0)), 2)

    descriptions = {
        "Economy": "Compact and budget-friendly city cars",
        "Comfort": "Balanced daily-use sedans and family cars",
        "Premium": "Luxury and performance-oriented vehicles",
        "SUV": "Spacious utility and wagon-style vehicles",
    }

    return [
        VehicleCategory(
            name=name,
            description=descriptions.get(name, f"{name} vehicles"),
            base_price_per_hour=price,
        )
        for name, price in prices.items()
    ]


def _seed_vehicles_from_dataset(dataset_path: Path | None, categories_by_name: dict[str, VehicleCategory]) -> list[Vehicle]:
    if dataset_path is None:
        return [
            Vehicle(
                category_id=categories_by_name["Economy"].id,
                registration_number="ABC-1001",
                make="Honda",
                model="Civic",
                year=2022,
                fuel_type="gas",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=categories_by_name["Economy"].id,
                registration_number="ABC-1002",
                make="Toyota",
                model="Corolla",
                year=2022,
                fuel_type="gas",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=categories_by_name["Comfort"].id,
                registration_number="COM-2001",
                make="BMW",
                model="3 Series",
                year=2023,
                fuel_type="gas",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=categories_by_name["Premium"].id,
                registration_number="LUX-3001",
                make="Mercedes-Benz",
                model="E-Class",
                year=2023,
                fuel_type="diesel",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=categories_by_name["SUV"].id,
                registration_number="SUV-4001",
                make="Toyota",
                model="Highlander",
                year=2023,
                fuel_type="gas",
                seating_capacity=7,
                status="available",
                is_active=True,
            ),
        ]

    vehicles: list[Vehicle] = []
    seen_keys: set[tuple[str, str, int]] = set()
    with dataset_path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for idx, row in enumerate(reader, start=1):
            make = (row.get("make") or "unknown").strip().title()
            model = (row.get("body-style") or "Model").strip().title()
            year = _safe_int(row.get("symboling"), 0)
            derived_year = 2018 + max(-2, min(6, year))

            dedupe_key = (make.lower(), model.lower(), derived_year)
            if dedupe_key in seen_keys:
                continue
            seen_keys.add(dedupe_key)

            body_style = (row.get("body-style") or "sedan").strip().lower()
            fuel_type = (row.get("fuel-type") or "gas").strip().lower()
            category_name = BODY_STYLE_CATEGORY_MAP.get(body_style, "Comfort")
            category = categories_by_name.get(category_name, categories_by_name["Comfort"])

            seating_capacity = BODY_STYLE_SEATS_MAP.get(body_style, 5)
            registration_number = f"{make[:3].upper()}-{idx:04d}"

            vehicles.append(
                Vehicle(
                    category_id=category.id,
                    registration_number=registration_number,
                    make=make,
                    model=model,
                    year=derived_year,
                    fuel_type=fuel_type,
                    seating_capacity=seating_capacity,
                    status="available",
                    is_active=True,
                )
            )

    return vehicles


def seed_database():
    with app.app_context():
        dataset_path = _resolve_dataset_path()
        if dataset_path:
            print(f"📄 Dataset found: {dataset_path}")
        else:
            print("⚠️  Automobile dataset not found. Using fallback sample vehicles.")

        print("🔄 Clearing existing data...")
        db.drop_all()

        print("📦 Creating tables...")
        db.create_all()

        print("🌱 Seeding vehicle categories...")
        categories = _build_categories_from_dataset(dataset_path)
        for cat in categories:
            db.session.add(cat)
        db.session.commit()
        print(f"✓ Added {len(categories)} vehicle categories")

        categories_by_name = {category.name: category for category in VehicleCategory.query.all()}

        print("🌱 Seeding users...")
        users = [
            User(
                name="John Customer",
                email="customer@example.com",
                role="customer",
                phone="555-0001",
                license_number="DL123456",
            ),
            User(
                name="Alice Admin",
                email="admin@example.com",
                role="admin",
                phone="555-0002",
            ),
            User(
                name="Bob FleetManager",
                email="fleet@example.com",
                role="fleet_manager",
                phone="555-0003",
            ),
        ]
        for user in users:
            user.set_password("password123")
            db.session.add(user)
        db.session.commit()
        print(f"✓ Added {len(users)} users")

        print("🌱 Seeding vehicles...")
        vehicles = _seed_vehicles_from_dataset(dataset_path, categories_by_name)
        for vehicle in vehicles:
            db.session.add(vehicle)
        db.session.commit()
        print(f"✓ Added {len(vehicles)} vehicles")

        print("🌱 Seeding pricing rules...")
        now = datetime.utcnow()
        rules = [
            PricingRule(
                category_id=None,
                name="Weekend Surcharge",
                description="Extra 15% on weekends",
                rule_type="weekend",
                multiplier=1.15,
                is_active=True,
            ),
            PricingRule(
                category_id=None,
                name="Summer Peak",
                description="20% increase during summer",
                rule_type="seasonal",
                multiplier=1.20,
                start_date=now.replace(month=6, day=1),
                end_date=now.replace(month=8, day=31),
                is_active=True,
            ),
            PricingRule(
                category_id=1,
                name="Economy Discount",
                description="10% discount on economy cars for bookings over 3 days",
                rule_type="peak",
                multiplier=0.90,
                is_active=True,
            ),
        ]
        for rule in rules:
            db.session.add(rule)
        db.session.commit()
        print(f"✓ Added {len(rules)} pricing rules")

        print("🌱 Seeding sample bookings...")
        customer_user = User.query.filter_by(email="customer@example.com").first()
        vehicle = Vehicle.query.first()
        second_vehicle = Vehicle.query.filter(Vehicle.id != vehicle.id).first() or vehicle
        third_vehicle = Vehicle.query.filter(Vehicle.id.notin_([vehicle.id, second_vehicle.id])).first() or vehicle

        pickup_time = datetime.utcnow() + timedelta(days=5)
        return_time = pickup_time + timedelta(days=3)

        pending_booking = Booking(
            user_id=customer_user.id,
            vehicle_id=vehicle.id,
            pickup_time=pickup_time,
            return_time=return_time,
            pickup_location="Main Airport",
            total_price=450.00,
            status="pending",
        )

        completed_booking = Booking(
            user_id=customer_user.id,
            vehicle_id=second_vehicle.id,
            pickup_time=datetime.utcnow() - timedelta(days=9),
            return_time=datetime.utcnow() - timedelta(days=6),
            pickup_location="Downtown Hub",
            total_price=620.00,
            status="completed",
        )

        refunded_booking = Booking(
            user_id=customer_user.id,
            vehicle_id=third_vehicle.id,
            pickup_time=datetime.utcnow() - timedelta(days=4),
            return_time=datetime.utcnow() - timedelta(days=2),
            pickup_location="Tech Park",
            total_price=510.00,
            status="canceled",
        )

        db.session.add_all([pending_booking, completed_booking, refunded_booking])
        db.session.commit()
        print("✓ Added 3 sample bookings (pending/completed/canceled)")

        print("🌱 Seeding booking status log...")
        status_logs = [
            BookingStatusLog(
                booking_id=pending_booking.id,
                old_status=None,
                new_status="pending",
                reason="Booking created",
            ),
            BookingStatusLog(
                booking_id=completed_booking.id,
                old_status="active",
                new_status="completed",
                reason="Vehicle returned",
            ),
            BookingStatusLog(
                booking_id=refunded_booking.id,
                old_status="confirmed",
                new_status="canceled",
                reason="Customer canceled booking",
            ),
        ]
        db.session.add_all(status_logs)
        db.session.commit()
        print("✓ Added booking status logs for all sample bookings")

        print("🌱 Seeding payment records...")
        payments = [
            Payment(
                booking_id=pending_booking.id,
                amount=pending_booking.total_price,
                payment_method="credit_card",
                status="pending",
            ),
            Payment(
                booking_id=completed_booking.id,
                amount=completed_booking.total_price,
                payment_method="upi",
                status="success",
                transaction_id="TXN-DEMO-SUCCESS-0001",
            ),
            Payment(
                booking_id=refunded_booking.id,
                amount=refunded_booking.total_price,
                payment_method="credit_card",
                status="refunded",
                transaction_id="TXN-DEMO-REFUND-0001",
            ),
        ]
        db.session.add_all(payments)
        db.session.commit()
        print("✓ Added 3 payment records (pending/success/refunded)")

        print("🌱 Creating dummy invoice-ready reference...")
        print(f"   • Completed booking invoice can be fetched with booking_id={completed_booking.id}")

        print("🌱 Seeding maintenance record...")
        maintenance = Maintenance(
            vehicle_id=vehicle.id,
            description="Regular oil change and filter replacement",
            scheduled_date=now + timedelta(days=30),
            status="scheduled",
            cost=150.00,
        )
        db.session.add(maintenance)
        db.session.commit()
        print(f"✓ Added maintenance record")

        print("\n✅ Database seeded successfully!")
        print("\n📋 Sample Login Credentials:")
        print("   Customer: customer@example.com / password123")
        print("   Admin: admin@example.com / password123")
        print("   Fleet Manager: fleet@example.com / password123")
        print("\n🧾 Dummy Invoice Test:")
        print(f"   GET /api/payments/invoice/{completed_booking.id} (with customer token)")


if __name__ == "__main__":
    seed_database()
