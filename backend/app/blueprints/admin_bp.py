from sqlalchemy import func
from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.models.vehicle import Vehicle
from app.utils.decorators import role_required
from app.utils.responses import success_response

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/users")
@jwt_required()
@role_required("admin")
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return success_response({"users": [user.to_dict() for user in users]})


@admin_bp.get("/analytics")
@jwt_required()
@role_required("admin")
def analytics():
    total_users = User.query.count()
    total_vehicles = Vehicle.query.filter_by(is_active=True).count()
    total_bookings = Booking.query.count()
    active_bookings = Booking.query.filter(Booking.status.in_(["confirmed", "active"])).count()
    completed_bookings = Booking.query.filter_by(status="completed").count()

    revenue = (
        Payment.query.with_entities(func.coalesce(func.sum(Payment.amount), 0))
        .filter(Payment.status == "success")
        .scalar()
    )

    return success_response(
        {
            "analytics": {
                "total_users": total_users,
                "total_vehicles": total_vehicles,
                "total_bookings": total_bookings,
                "active_bookings": active_bookings,
                "completed_bookings": completed_bookings,
                "total_revenue": float(revenue or 0),
            }
        }
    )
