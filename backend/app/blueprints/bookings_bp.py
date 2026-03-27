from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.booking import Booking
from app.models.booking_status_log import BookingStatusLog
from app.schemas.booking_schema import (
    BookingCreateSchema,
    BookingExtendSchema,
    BookingEstimateSchema,
    BookingListQuerySchema,
    BookingStatusUpdateSchema,
)
from app.utils.decorators import role_required
from app.services.booking_service import create_booking, estimate_booking_price, extend_booking
from app.utils.decorators import rate_limit
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

bookings_bp = Blueprint("bookings", __name__)


def _log_status_transition(booking: Booking, new_status: str, reason: str | None = None):
    previous_status = booking.status
    booking.status = new_status
    db.session.add(
        BookingStatusLog(
            booking_id=booking.id,
            old_status=previous_status,
            new_status=new_status,
            reason=reason,
        )
    )


@bookings_bp.post("/estimate")
@jwt_required()
@rate_limit(max_calls=30, period_seconds=60)
def estimate_booking():
    payload, error = validate_or_400(BookingEstimateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    try:
        total_price = estimate_booking_price(
            vehicle_id=payload["vehicle_id"],
            pickup_time=payload["pickup_time"],
            return_time=payload["return_time"],
            coupon_code=payload.get("coupon_code"),
        )
    except ValueError as err:
        return error_response("VALIDATION_ERROR", str(err), 400)

    return success_response({"total_price": total_price})


@bookings_bp.post("")
@jwt_required()
@rate_limit(max_calls=20, period_seconds=60)
def create_booking_route():
    payload, error = validate_or_400(BookingCreateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    user_id = int(get_jwt_identity())
    booking, booking_error = create_booking(
        user_id=user_id,
        vehicle_id=payload["vehicle_id"],
        pickup_time=payload["pickup_time"],
        return_time=payload["return_time"],
        location=payload["pickup_location"],
        coupon_code=payload.get("coupon_code"),
    )

    if booking_error:
        return error_response("BOOKING_ERROR", booking_error, 409)

    return success_response({"booking": booking.to_dict()}, 201)


@bookings_bp.get("")
@jwt_required()
def list_my_bookings():
    user_id = int(get_jwt_identity())
    query_data, error = validate_or_400(BookingListQuerySchema(), request.args.to_dict())
    if error:
        return error

    query = Booking.query.filter(Booking.user_id == user_id)
    if query_data.get("status"):
        query = query.filter(Booking.status == query_data["status"])

    page = query_data.get("page", 1)
    per_page = query_data.get("per_page", 20)
    pagination = query.order_by(Booking.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return success_response(
        data={"items": [item.to_dict() for item in pagination.items]},
        meta={"page": page, "per_page": per_page, "total": pagination.total},
    )


@bookings_bp.get("/<int:booking_id>")
@jwt_required()
def get_booking(booking_id: int):
    user_id = int(get_jwt_identity())
    booking = Booking.query.get(booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)
    if booking.user_id != user_id:
        return error_response("FORBIDDEN", "You cannot access this booking", 403)

    return success_response({"booking": booking.to_dict()})


@bookings_bp.put("/<int:booking_id>/cancel")
@jwt_required()
def cancel_booking(booking_id: int):
    user_id = int(get_jwt_identity())
    booking = Booking.query.get(booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)
    if booking.user_id != user_id:
        return error_response("FORBIDDEN", "You cannot cancel this booking", 403)
    if booking.status not in ("pending", "confirmed"):
        return error_response("STATE_ERROR", "Only pending/confirmed bookings can be canceled", 409)

    _log_status_transition(booking, "canceled", reason="Customer canceled booking")
    db.session.commit()
    return success_response({"booking": booking.to_dict()})


@bookings_bp.put("/<int:booking_id>/extend")
@jwt_required()
def extend_booking_route(booking_id: int):
    user_id = int(get_jwt_identity())
    booking = Booking.query.get(booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)
    if booking.user_id != user_id:
        return error_response("FORBIDDEN", "You cannot extend this booking", 403)

    payload, error = validate_or_400(BookingExtendSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    booking, booking_error = extend_booking(
        booking=booking,
        new_return_time=payload["return_time"],
        coupon_code=payload.get("coupon_code"),
    )
    if booking_error:
        return error_response("BOOKING_ERROR", booking_error, 409)

    return success_response({"booking": booking.to_dict()})


@bookings_bp.put("/<int:booking_id>/pickup")
@jwt_required()
@role_required("fleet_manager", "admin")
def mark_pickup(booking_id: int):
    booking = Booking.query.get(booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)

    if booking.status != "confirmed":
        return error_response("STATE_ERROR", "Only confirmed bookings can be marked as picked up", 409)

    _log_status_transition(booking, "active", reason="Vehicle picked up")
    if booking.vehicle:
        booking.vehicle.status = "booked"
    db.session.commit()
    return success_response({"booking": booking.to_dict()})


@bookings_bp.put("/<int:booking_id>/return")
@jwt_required()
@role_required("fleet_manager", "admin")
def mark_return(booking_id: int):
    booking = Booking.query.get(booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)

    if booking.status != "active":
        return error_response("STATE_ERROR", "Only active bookings can be marked as returned", 409)

    _log_status_transition(booking, "completed", reason="Vehicle returned")
    if booking.vehicle:
        booking.vehicle.status = "available"
    db.session.commit()
    return success_response({"booking": booking.to_dict()})


@bookings_bp.put("/<int:booking_id>/status")
@jwt_required()
@role_required("fleet_manager", "admin")
def update_booking_status(booking_id: int):
    booking = Booking.query.get(booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)

    payload, error = validate_or_400(BookingStatusUpdateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    _log_status_transition(booking, payload["status"], reason="Status updated by fleet/admin")
    if booking.vehicle and payload["status"] == "active":
        booking.vehicle.status = "booked"
    if booking.vehicle and payload["status"] in ("completed", "canceled"):
        booking.vehicle.status = "available"

    db.session.commit()
    return success_response({"booking": booking.to_dict()})
