from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.pricing_rule import PricingRule
from app.models.vehicle_category import VehicleCategory
from app.schemas.pricing_schema import PricingRuleCreateSchema, PricingRuleUpdateSchema
from app.utils.decorators import role_required
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

pricing_bp = Blueprint("pricing", __name__)


@pricing_bp.get("/rules")
@jwt_required()
@role_required("admin")
def get_pricing_rules():
    rules = PricingRule.query.filter_by(is_active=True).order_by(PricingRule.created_at.desc()).all()
    return success_response({"rules": [r.to_dict() for r in rules]})


@pricing_bp.post("/rules")
@jwt_required()
@role_required("admin")
def create_pricing_rule():
    payload, error = validate_or_400(PricingRuleCreateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    if payload.get("category_id"):
        category = VehicleCategory.query.get(payload["category_id"])
        if category is None:
            return error_response("NOT_FOUND", "Vehicle category not found", 404)

    rule = PricingRule(**payload)
    db.session.add(rule)
    db.session.commit()
    return success_response({"rule": rule.to_dict()}, 201)


@pricing_bp.put("/rules/<int:rule_id>")
@jwt_required()
@role_required("admin")
def update_pricing_rule(rule_id: int):
    rule = PricingRule.query.get(rule_id)
    if rule is None:
        return error_response("NOT_FOUND", "Pricing rule not found", 404)

    payload, error = validate_or_400(PricingRuleUpdateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    for key, value in payload.items():
        if value is not None:
            setattr(rule, key, value)

    db.session.commit()
    return success_response({"rule": rule.to_dict()})


@pricing_bp.delete("/rules/<int:rule_id>")
@jwt_required()
@role_required("admin")
def deactivate_pricing_rule(rule_id: int):
    rule = PricingRule.query.get(rule_id)
    if rule is None:
        return error_response("NOT_FOUND", "Pricing rule not found", 404)

    rule.is_active = False
    db.session.commit()
    return success_response({"rule": rule.to_dict()})
