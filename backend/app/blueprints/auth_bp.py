from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from app.extensions import db
from app.models.user import User
from app.schemas.auth_schema import LoginSchema, RegisterSchema, UpdateProfileSchema
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload, error = validate_or_400(RegisterSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    existing_user = User.query.filter_by(email=payload["email"].lower()).first()
    if existing_user:
        return error_response("CONFLICT", "Email already exists", 409)

    user = User(
        name=payload["name"],
        email=payload["email"].lower(),
        role=payload.get("role", "customer"),
        phone=payload.get("phone"),
        license_number=payload.get("license_number"),
    )
    user.set_password(payload["password"])

    db.session.add(user)
    db.session.commit()

    return success_response({"user": user.to_dict()}, 201)


@auth_bp.post("/login")
def login():
    payload, error = validate_or_400(LoginSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    user = User.query.filter_by(email=payload["email"].lower()).first()
    if not user or not user.check_password(payload["password"]):
        return error_response("AUTH_ERROR", "Invalid email or password", 401)

    identity = str(user.id)
    access_token = create_access_token(identity=identity, additional_claims={"role": user.role})
    refresh_token = create_refresh_token(identity=identity, additional_claims={"role": user.role})

    return success_response(
        {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict(),
        }
    )


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if user is None:
        return error_response("NOT_FOUND", "User not found", 404)

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return success_response({"access_token": access_token})


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if user is None:
        return error_response("NOT_FOUND", "User not found", 404)

    return success_response({"user": user.to_dict()})


@auth_bp.put("/me")
@jwt_required()
def update_me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if user is None:
        return error_response("NOT_FOUND", "User not found", 404)

    payload, error = validate_or_400(UpdateProfileSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    if not payload:
        return error_response("VALIDATION_ERROR", "No updatable fields provided", 400)

    if "name" in payload:
        user.name = payload["name"]
    if "phone" in payload:
        user.phone = payload["phone"]
    if "license_number" in payload:
        user.license_number = payload["license_number"]

    db.session.commit()
    return success_response({"user": user.to_dict()})
