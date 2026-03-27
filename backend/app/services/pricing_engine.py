from datetime import datetime, timedelta

from app.models.pricing_rule import PricingRule
from app.models.vehicle import Vehicle


def _overlaps_window(start_a: datetime, end_a: datetime, start_b: datetime | None, end_b: datetime | None) -> bool:
    if start_b is None and end_b is None:
        return True

    normalized_start = start_b or datetime.min
    normalized_end = end_b or datetime.max
    return start_a < normalized_end and end_a > normalized_start


def _has_weekend_in_range(start_time: datetime, end_time: datetime) -> bool:
    cursor = start_time
    while cursor < end_time:
        if cursor.weekday() in (5, 6):
            return True
        cursor += timedelta(days=1)
    return False


def _is_rule_applicable(rule: PricingRule, pickup_time: datetime, return_time: datetime, duration_hours: float, coupon_code: str | None) -> bool:
    if not _overlaps_window(pickup_time, return_time, rule.start_date, rule.end_date):
        return False

    if rule.rule_type == "weekend":
        return _has_weekend_in_range(pickup_time, return_time)

    if rule.rule_type == "peak":
        return duration_hours >= 72

    if rule.rule_type == "coupon":
        if not coupon_code:
            return False
        return (rule.name or "").strip().lower() == coupon_code.strip().lower()

    return True


def calculate_price(vehicle_id: int, pickup_time: datetime, return_time: datetime, coupon_code: str | None = None) -> float:
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or vehicle.category is None:
        raise ValueError("Vehicle or category not found")

    duration_hours = max((return_time - pickup_time).total_seconds() / 3600, 1)
    base_rate = float(vehicle.category.base_price_per_hour)
    subtotal = base_rate * duration_hours

    rule_query = PricingRule.query.filter(
        PricingRule.is_active.is_(True),
        (PricingRule.category_id.is_(None) | (PricingRule.category_id == vehicle.category_id)),
    )
    rules = rule_query.order_by(PricingRule.created_at.asc()).all()

    multiplier = 1.0
    for rule in rules:
        if _is_rule_applicable(rule, pickup_time, return_time, duration_hours, coupon_code):
            multiplier *= float(rule.multiplier)

    total = subtotal * multiplier
    return round(total, 2)
