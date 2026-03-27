import os
import uuid

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from sqlalchemy import or_
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.vehicle_category import VehicleCategory
from app.schemas.vehicle_schema import (
    VehicleAvailabilityQuerySchema,
    VehicleCreateSchema,
    VehicleListQuerySchema,
    VehicleUpdateSchema,
)
from app.utils.decorators import role_required
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

vehicles_bp = Blueprint("vehicles", __name__)


@vehicles_bp.get("")
def list_vehicles():
    query_data, error = validate_or_400(VehicleListQuerySchema(), request.args.to_dict())
    if error:
        return error

    query = Vehicle.query.join(VehicleCategory, Vehicle.category_id == VehicleCategory.id).filter(Vehicle.is_active.is_(True))

    if query_data.get("category_id"):
        query = query.filter(Vehicle.category_id == query_data["category_id"])
    if query_data.get("type"):
        query = query.filter(VehicleCategory.name.ilike(query_data["type"]))
    if query_data.get("fuel_type"):
        query = query.filter(Vehicle.fuel_type == query_data["fuel_type"])
    if query_data.get("seats"):
        query = query.filter(Vehicle.seating_capacity == query_data["seats"])
    if query_data.get("status"):
        query = query.filter(Vehicle.status == query_data["status"])
    if query_data.get("query"):
        search_text = f"%{query_data['query']}%"
        query = query.filter(
            or_(
                Vehicle.make.ilike(search_text),
                Vehicle.model.ilike(search_text),
                Vehicle.registration_number.ilike(search_text),
            )
        )
    if query_data.get("min_price") is not None:
        query = query.filter(VehicleCategory.base_price_per_hour * 24 >= query_data["min_price"])
    if query_data.get("max_price") is not None:
        query = query.filter(VehicleCategory.base_price_per_hour * 24 <= query_data["max_price"])

    page = query_data.get("page", 1)
    per_page = query_data.get("per_page", 20)
    pagination = query.order_by(Vehicle.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return success_response(
        data={"items": [item.to_dict() for item in pagination.items]},
        meta={"page": page, "per_page": per_page, "total": pagination.total},
    )


@vehicles_bp.get("/<int:vehicle_id>")
def get_vehicle(vehicle_id: int):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        return error_response("NOT_FOUND", "Vehicle not found", 404)
    return success_response({"vehicle": vehicle.to_dict()})


@vehicles_bp.post("")
@jwt_required()
@role_required("fleet_manager", "admin")
def create_vehicle():
    payload, error = validate_or_400(VehicleCreateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    duplicate = Vehicle.query.filter_by(registration_number=payload["registration_number"]).first()
    if duplicate:
        return error_response("CONFLICT", "Registration number already exists", 409)

    vehicle = Vehicle(**payload)
    db.session.add(vehicle)
    db.session.commit()
    return success_response({"vehicle": vehicle.to_dict()}, 201)


@vehicles_bp.get("/<int:vehicle_id>/availability")
def vehicle_availability(vehicle_id: int):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        return error_response("NOT_FOUND", "Vehicle not found", 404)

    query_data, error = validate_or_400(VehicleAvailabilityQuerySchema(), request.args.to_dict())
    if error:
        return error

    pickup_time = query_data["pickup_time"]
    return_time = query_data["return_time"]
    if return_time <= pickup_time:
        return error_response("VALIDATION_ERROR", "return_time must be after pickup_time", 400)

    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(["pending", "confirmed", "active"]),
        Booking.pickup_time < return_time,
        Booking.return_time > pickup_time,
    ).first()

    return success_response(
        {
            "vehicle_id": vehicle_id,
            "is_available": conflicting_booking is None and vehicle.status == "available",
            "status": vehicle.status,
        }
    )


@vehicles_bp.put("/<int:vehicle_id>")
@jwt_required()
@role_required("fleet_manager", "admin")
def update_vehicle(vehicle_id: int):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        return error_response("NOT_FOUND", "Vehicle not found", 404)

    payload, error = validate_or_400(VehicleUpdateSchema(), request.get_json(silent=True) or {})
    if error:
        return error
    if not payload:
        return error_response("VALIDATION_ERROR", "No updatable fields provided", 400)

    if "registration_number" in payload and payload["registration_number"] != vehicle.registration_number:
        duplicate = Vehicle.query.filter_by(registration_number=payload["registration_number"]).first()
        if duplicate:
            return error_response("CONFLICT", "Registration number already exists", 409)

    for key, value in payload.items():
        setattr(vehicle, key, value)

    db.session.commit()
    return success_response({"vehicle": vehicle.to_dict()})


@vehicles_bp.put("/<int:vehicle_id>/photo")
@jwt_required()
@role_required("fleet_manager", "admin")
def update_vehicle_photo(vehicle_id: int):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        return error_response("NOT_FOUND", "Vehicle not found", 404)

    if request.files and "photo" in request.files:
        uploaded = request.files["photo"]
        if not uploaded or not uploaded.filename:
            return error_response("VALIDATION_ERROR", "Missing uploaded photo file", 400)

        extension = uploaded.filename.rsplit(".", 1)[-1].lower() if "." in uploaded.filename else ""
        allowed_ext = {"png", "jpg", "jpeg", "webp"}
        if extension not in allowed_ext:
            return error_response("VALIDATION_ERROR", "Unsupported file type. Use png/jpg/jpeg/webp", 400)

        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
        os.makedirs(upload_dir, exist_ok=True)

        safe_name = secure_filename(uploaded.filename)
        file_name = f"vehicle_{vehicle.id}_{uuid.uuid4().hex}_{safe_name}"
        file_path = os.path.join(upload_dir, file_name)
        uploaded.save(file_path)
        vehicle.image_url = f"/static/uploads/{file_name}"
    else:
        payload, error = validate_or_400(VehicleUpdateSchema(only=("image_url",)), request.get_json(silent=True) or {})
        if error:
            return error
        image_url = payload.get("image_url") if payload else None
        if not image_url:
            return error_response("VALIDATION_ERROR", "Provide image_url or multipart photo file", 400)
        vehicle.image_url = image_url

    db.session.commit()
    return success_response({"vehicle": vehicle.to_dict()})


@vehicles_bp.delete("/<int:vehicle_id>")
@jwt_required()
@role_required("fleet_manager", "admin")
def delete_vehicle(vehicle_id: int):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None or not vehicle.is_active:
        return error_response("NOT_FOUND", "Vehicle not found", 404)

    vehicle.is_active = False
    db.session.commit()
    return success_response({"vehicle": vehicle.to_dict()})
