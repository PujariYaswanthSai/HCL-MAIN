from datetime import datetime

from app.extensions import db
from app.models.booking import Booking
from app.models.booking_status_log import BookingStatusLog
from app.models.vehicle import Vehicle
from app.services.pricing_engine import calculate_price


ACTIVE_STATUSES = {"pending", "confirmed", "active"}


def check_availability(vehicle_id: int, pickup_time: datetime, return_time: datetime, exclude_booking_id: int | None = None) -> bool:
    query = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(ACTIVE_STATUSES),
        Booking.pickup_time < return_time,
        Booking.return_time > pickup_time,
    )
    if exclude_booking_id is not None:
        query = query.filter(Booking.id != exclude_booking_id)

    conflict = query.order_by(Booking.pickup_time.asc()).first()
    return conflict is None


def estimate_booking_price(vehicle_id: int, pickup_time: datetime, return_time: datetime, coupon_code: str | None = None) -> float:
    if return_time <= pickup_time:
        raise ValueError("return_time must be after pickup_time")

    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        raise ValueError("Vehicle not found or inactive")

    return calculate_price(vehicle_id, pickup_time, return_time, coupon_code=coupon_code)


def create_booking(
    user_id: int,
    vehicle_id: int,
    pickup_time: datetime,
    return_time: datetime,
    location: str,
    coupon_code: str | None = None,
):
    if return_time <= pickup_time:
        return None, "Return time must be after pickup time"

    if not check_availability(vehicle_id, pickup_time, return_time):
        return None, "Vehicle not available for selected dates"

    try:
        total_price = estimate_booking_price(vehicle_id, pickup_time, return_time, coupon_code=coupon_code)
    except ValueError as err:
        return None, str(err)

    booking = Booking(
        user_id=user_id,
        vehicle_id=vehicle_id,
        pickup_time=pickup_time,
        return_time=return_time,
        pickup_location=location,
        total_price=total_price,
        status="pending",
    )

    db.session.add(booking)
    db.session.flush()
    db.session.add(
        BookingStatusLog(
            booking_id=booking.id,
            old_status=None,
            new_status="pending",
            reason="Booking created",
        )
    )
    db.session.commit()
    return booking, None


def extend_booking(booking: Booking, new_return_time: datetime, coupon_code: str | None = None):
    if new_return_time <= booking.return_time:
        return None, "New return time must be after current return time"

    if booking.status not in {"pending", "confirmed", "active"}:
        return None, "Only pending/confirmed/active bookings can be extended"

    if not check_availability(booking.vehicle_id, booking.return_time, new_return_time, exclude_booking_id=booking.id):
        return None, "Vehicle is not available for the requested extension window"

    try:
        updated_total = estimate_booking_price(
            vehicle_id=booking.vehicle_id,
            pickup_time=booking.pickup_time,
            return_time=new_return_time,
            coupon_code=coupon_code,
        )
    except ValueError as err:
        return None, str(err)

    booking.return_time = new_return_time
    booking.total_price = updated_total
    db.session.commit()
    return booking, None
