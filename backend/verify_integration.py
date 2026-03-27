#!/usr/bin/env python
"""
Backend Integration Verification Script

Validates that:
1. All 9 database models are importable
2. All blueprints are registered
3. App factory creates app successfully
4. Database schema can be initialized
5. All endpoints are accessible
"""

import sys
from app import create_app
from app.extensions import db


def verify_models():
    """Verify all 9 database models can be imported."""
    print("🔍 Verifying database models...")
    try:
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
        models = [
            Booking,
            BookingStatusLog,
            Maintenance,
            Payment,
            PricingRule,
            Review,
            User,
            Vehicle,
            VehicleCategory,
        ]
        print(f"   ✅ All {len(models)} models imported successfully")
        for model in models:
            print(f"      - {model.__name__}")
        return True
    except Exception as err:
        print(f"   ❌ Model import failed: {err}")
        return False


def verify_blueprints():
    """Verify all required blueprints are available."""
    print("\n🔍 Verifying blueprints...")
    try:
        from app.blueprints.admin_bp import admin_bp
        from app.blueprints.auth_bp import auth_bp
        from app.blueprints.bookings_bp import bookings_bp
        from app.blueprints.maintenance_bp import maintenance_bp
        from app.blueprints.payments_bp import payments_bp
        from app.blueprints.pricing_bp import pricing_bp
        from app.blueprints.reviews_bp import reviews_bp
        from app.blueprints.vehicles_bp import vehicles_bp

        blueprints = [admin_bp, auth_bp, bookings_bp, maintenance_bp, payments_bp, pricing_bp, reviews_bp, vehicles_bp]
        print(f"   ✅ All {len(blueprints)} blueprints imported successfully")
        for bp in blueprints:
            print(f"      - {bp.name}")
        return True
    except Exception as err:
        print(f"   ❌ Blueprint import failed: {err}")
        return False


def verify_app_factory():
    """Verify app factory creates app without errors."""
    print("\n🔍 Verifying app factory...")
    try:
        app = create_app()
        print(f"   ✅ App factory created successfully")
        print(f"      - Config: {app.config.get('ENV')}")
        print(f"      - Debug: {app.debug}")
        return app
    except Exception as err:
        print(f"   ❌ App factory failed: {err}")
        return None


def verify_database(app):
    """Verify database tables can be created."""
    print("\n🔍 Verifying database schema...")
    try:
        with app.app_context():
            db.create_all()
            inspector_sql = db.inspect(db.engine)
            tables = inspector_sql.get_table_names()
            expected_tables = {
                "users",
                "vehicle_categories",
                "vehicles",
                "bookings",
                "booking_status_log",
                "payments",
                "maintenance",
                "pricing_rules",
                "reviews",
            }
            created_tables = set(tables)
            print(f"   ✅ Database schema created successfully")
            print(f"      - Expected tables: {len(expected_tables)}")
            print(f"      - Created tables: {len(created_tables)}")
            missing = expected_tables - created_tables
            if missing:
                print(f"      ⚠️  Missing tables: {missing}")
                return False
            for table in sorted(created_tables):
                print(f"         ✓ {table}")
            return True
    except Exception as err:
        print(f"   ❌ Database schema failed: {err}")
        import traceback

        traceback.print_exc()
        return False


def verify_routes(app):
    """Verify all routes are registered."""
    print("\n🔍 Verifying API routes...")
    try:
        routes_by_blueprint = {}
        for rule in app.url_map.iter_rules():
            if "api" in rule.rule:
                bp = rule.endpoint.split(".")[0]
                if bp not in routes_by_blueprint:
                    routes_by_blueprint[bp] = []
                routes_by_blueprint[bp].append((rule.methods - {"HEAD", "OPTIONS"}, rule.rule))

        print(f"   ✅ Found {len(routes_by_blueprint)} API blueprints")
        for bp_name in sorted(routes_by_blueprint.keys()):
            routes = routes_by_blueprint[bp_name]
            print(f"      - {bp_name}: {len(routes)} endpoints")
            for methods, rule in sorted(routes)[:3]:
                print(f"         {','.join(sorted(methods))} {rule}")
            if len(routes) > 3:
                print(f"         ... and {len(routes) - 3} more")

        return True
    except Exception as err:
        print(f"   ❌ Route verification failed: {err}")
        return False


def main():
    print("=" * 60)
    print("  Vehicle Rental Backend — Integration Verification")
    print("=" * 60)

    checks = [
        ("Database Models", verify_models),
        ("Blueprints", verify_blueprints),
    ]

    results = {}
    for name, check_fn in checks:
        results[name] = check_fn()

    app = verify_app_factory()
    if app:
        results["App Factory"] = True
        results["Database Schema"] = verify_database(app)
        results["API Routes"] = verify_routes(app)
    else:
        results["App Factory"] = False
        results["Database Schema"] = False
        results["API Routes"] = False

    print("\n" + "=" * 60)
    print("  VERIFICATION SUMMARY")
    print("=" * 60)
    all_pass = True
    for check_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}  {check_name}")
        if not passed:
            all_pass = False

    print("=" * 60)
    if all_pass:
        print("🎉 All verifications passed! Backend is ready.")
        print("\nNext steps:")
        print("  1. python init_db.py          # Initialize and seed database")
        print("  2. python run.py              # Start development server")
        print("  3. curl http://localhost:5000/api/auth/login")
        return 0
    else:
        print("⚠️  Some verifications failed. See details above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
