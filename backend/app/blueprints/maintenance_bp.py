from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.maintenance import Maintenance
from app.models.vehicle import Vehicle
from app.schemas.maintenance_schema import MaintenanceCreateSchema, MaintenanceUpdateSchema
from app.utils.decorators import role_required
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

maintenance_bp = Blueprint("maintenance", __name__)


@maintenance_bp.get("")
@jwt_required()
@role_required("fleet_manager", "admin")
def list_maintenance_logs():
    vehicle_id = request.args.get("vehicle_id", type=int)
    status = request.args.get("status", type=str)

    query = Maintenance.query
    if vehicle_id:
        query = query.filter(Maintenance.vehicle_id == vehicle_id)
    if status:
        query = query.filter(Maintenance.status == status)

    records = query.order_by(Maintenance.created_at.desc()).all()
    return success_response({"maintenance_records": [record.to_dict() for record in records]})


@maintenance_bp.post("")
@jwt_required()
@role_required("fleet_manager", "admin")
def create_maintenance():
    payload, error = validate_or_400(MaintenanceCreateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    vehicle = Vehicle.query.get(payload["vehicle_id"])
    if vehicle is None:
        return error_response("NOT_FOUND", "Vehicle not found", 404)

    vehicle.status = "maintenance"

    maintenance = Maintenance(
        vehicle_id=payload["vehicle_id"],
        description=payload["description"],
        scheduled_date=payload.get("scheduled_date"),
        cost=payload.get("cost"),
        status="scheduled",
    )

    db.session.add(maintenance)
    db.session.commit()
    return success_response({"maintenance": maintenance.to_dict()}, 201)


@maintenance_bp.get("/vehicle/<int:vehicle_id>")
@jwt_required()
@role_required("fleet_manager", "admin")
def get_vehicle_maintenance_history(vehicle_id: int):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle is None:
        return error_response("NOT_FOUND", "Vehicle not found", 404)

    records = Maintenance.query.filter_by(vehicle_id=vehicle_id).order_by(Maintenance.created_at.desc()).all()
    return success_response({"maintenance_records": [r.to_dict() for r in records]})


@maintenance_bp.get("/upcoming")
@jwt_required()
@role_required("fleet_manager", "admin")
def get_upcoming_maintenance():
    from datetime import datetime, timedelta

    thirty_days_from_now = datetime.utcnow() + timedelta(days=30)
    records = (
        Maintenance.query.filter(
            Maintenance.status.in_(["scheduled", "in_progress"]),
            Maintenance.scheduled_date <= thirty_days_from_now,
        )
        .order_by(Maintenance.scheduled_date.asc())
        .all()
    )

    return success_response({"upcoming_maintenance": [r.to_dict() for r in records]})


@maintenance_bp.patch("/<int:maintenance_id>/complete")
@jwt_required()
@role_required("fleet_manager", "admin")
def complete_maintenance(maintenance_id: int):
    from datetime import datetime

    maintenance = Maintenance.query.get(maintenance_id)
    if maintenance is None:
        return error_response("NOT_FOUND", "Maintenance record not found", 404)

    maintenance.status = "completed"
    maintenance.completion_date = datetime.utcnow()

    vehicle = Vehicle.query.get(maintenance.vehicle_id)
    if vehicle:
        vehicle.status = "available"

    db.session.commit()
    return success_response({"maintenance": maintenance.to_dict()})
