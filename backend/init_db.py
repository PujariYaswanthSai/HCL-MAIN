#!/usr/bin/env python
"""
Database initialization script for Vehicle Rental Platform.

Usage:
    python init_db.py      # Initialize and seed the database
    python init_db.py --seed-only   # Seed data only (tables must exist)
"""

import sys
from app import create_app
from app.extensions import db


def init_database(seed_only=False):
    app = create_app()

    with app.app_context():
        if not seed_only:
            print("🗑️  Dropping old database...")
            db.drop_all()

            print("📦 Creating all tables...")
            db.create_all()
            print("✅ Database tables created successfully!")
        else:
            print("⏭️  Skipping table creation, applying seed data only...")

        print("\n🌱 Seeding sample data...")
        from seed import seed_database

        seed_database()


if __name__ == "__main__":
    seed_only = "--seed-only" in sys.argv
    init_database(seed_only=seed_only)
