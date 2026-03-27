#!/usr/bin/env python
import os
from datetime import datetime, timedelta

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


def seed_database():
    with app.app_context():
        print("🔄 Clearing existing data...")
        db.drop_all()

        print("📦 Creating tables...")
        db.create_all()

        print("🌱 Seeding vehicle categories...")
        categories = [
            VehicleCategory(name="Economy", description="Budget-friendly vehicles", base_price_per_hour=25.00),
            VehicleCategory(name="Comfort", description="Mid-range vehicles", base_price_per_hour=45.00),
            VehicleCategory(name="Premium", description="Luxury vehicles", base_price_per_hour=75.00),
            VehicleCategory(name="SUV", description="Sport utility vehicles", base_price_per_hour=60.00),
        ]
        for cat in categories:
            db.session.add(cat)
        db.session.commit()
        print(f"✓ Added {len(categories)} vehicle categories")

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
        vehicles = [
            Vehicle(
                category_id=1,
                registration_number="ABC-1001",
                make="Honda",
                model="Civic",
                year=2022,
                fuel_type="Petrol",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=1,
                registration_number="ABC-1002",
                make="Toyota",
                model="Corolla",
                year=2022,
                fuel_type="Hybrid",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=2,
                registration_number="COM-2001",
                make="BMW",
                model="3 Series",
                year=2023,
                fuel_type="Petrol",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=3,
                registration_number="LUX-3001",
                make="Mercedes-Benz",
                model="E-Class",
                year=2023,
                fuel_type="Diesel",
                seating_capacity=5,
                status="available",
                is_active=True,
            ),
            Vehicle(
                category_id=4,
                registration_number="SUV-4001",
                make="Toyota",
                model="Highlander",
                year=2023,
                fuel_type="Petrol",
                seating_capacity=7,
                status="available",
                is_active=True,
            ),
        ]
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

        pickup_time = datetime.utcnow() + timedelta(days=5)
        return_time = pickup_time + timedelta(days=3)

        booking = Booking(
            user_id=customer_user.id,
            vehicle_id=vehicle.id,
            pickup_time=pickup_time,
            return_time=return_time,
            pickup_location="Main Airport",
            total_price=450.00,
            status="pending",
        )
        db.session.add(booking)
        db.session.commit()
        print(f"✓ Added sample booking")

        print("🌱 Seeding booking status log...")
        status_log = BookingStatusLog(
            booking_id=booking.id,
            old_status=None,
            new_status="pending",
            reason="Booking created",
        )
        db.session.add(status_log)
        db.session.commit()
        print(f"✓ Added booking status log")

        print("🌱 Seeding payment record...")
        payment = Payment(
            booking_id=booking.id,
            amount=booking.total_price,
            payment_method="credit_card",
            status="pending",
        )
        db.session.add(payment)
        db.session.commit()
        print(f"✓ Added payment record")

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


if __name__ == "__main__":
    seed_database()
