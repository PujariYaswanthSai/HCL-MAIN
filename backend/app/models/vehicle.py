from datetime import datetime

from app.extensions import db


class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("vehicle_categories.id"), nullable=False, index=True)
    registration_number = db.Column(db.String(20), unique=True, nullable=False)
    make = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(80), nullable=False)
    year = db.Column(db.Integer, nullable=True)
    fuel_type = db.Column(db.String(20), nullable=True)
    seating_capacity = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="available")
    image_url = db.Column(db.String(300), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = db.relationship("VehicleCategory", back_populates="vehicles")
    bookings = db.relationship("Booking", back_populates="vehicle", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "category_id": self.category_id,
            "registration_number": self.registration_number,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "fuel_type": self.fuel_type,
            "seating_capacity": self.seating_capacity,
            "status": self.status,
            "image_url": self.image_url,
            "is_active": self.is_active,
            "category": self.category.to_dict() if self.category else None,
        }
