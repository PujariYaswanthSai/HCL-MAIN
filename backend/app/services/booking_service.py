from datetime import datetime

from app.extensions import db
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.services.pricing_engine import calculate_price


ACTIVE_STATUSES = {"pending", "confirmed", "active"}


def check_availability(vehicle_id: int, pickup_time: datetime, return_time: datetime) -> bool:
    conflict = (
        Booking.query.filter(
            Booking.vehicle_id == vehicle_id,
            Booking.status.in_(ACTIVE_STATUSES),
            Booking.pickup_time < return_time,
            Booking.return_time > pickup_time,
        )
        .order_by(Booking.pickup_time.asc())
        .first()
    )
    return conflict is None


def estimate_booking_price(vehicle_id: int, pickup_time: datetime, return_time: datetime) -> float:
    if return_time <= pickup_time:
        raise ValueError("return_time must be after pickup_time")

    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        raise ValueError("Vehicle not found or inactive")

    return calculate_price(vehicle_id, pickup_time, return_time)


def create_booking(user_id: int, vehicle_id: int, pickup_time: datetime, return_time: datetime, location: str):
    if return_time <= pickup_time:
        return None, "Return time must be after pickup time"

    if not check_availability(vehicle_id, pickup_time, return_time):
        return None, "Vehicle not available for selected dates"

    try:
        total_price = estimate_booking_price(vehicle_id, pickup_time, return_time)
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
    db.session.commit()
    return booking, None
