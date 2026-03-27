from datetime import datetime

from app.models.vehicle import Vehicle


def _weekend_multiplier(dt: datetime) -> float:
    return 1.15 if dt.weekday() in (5, 6) else 1.0


def calculate_price(vehicle_id: int, pickup_time: datetime, return_time: datetime) -> float:
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or vehicle.category is None:
        raise ValueError("Vehicle or category not found")

    duration_hours = max((return_time - pickup_time).total_seconds() / 3600, 1)
    base_rate = float(vehicle.category.base_price_per_hour)

    seasonal_multiplier = 1.0
    weekend_surcharge = _weekend_multiplier(pickup_time)

    total = base_rate * duration_hours * seasonal_multiplier * weekend_surcharge
    return round(total, 2)
