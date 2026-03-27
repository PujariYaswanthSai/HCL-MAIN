import uuid
from flask import Blueprint, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from app.extensions import db
from app.models.booking import Booking
from app.models.payment import Payment
from app.schemas.payment_schema import PaymentRefundSchema, PaymentSchema
from app.utils.decorators import role_required
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

payments_bp = Blueprint("payments", __name__)


@payments_bp.post("/initiate")
@jwt_required()
def initiate_payment():
    user_id = int(get_jwt_identity())
    payload, error = validate_or_400(PaymentSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    booking = Booking.query.filter_by(id=payload["booking_id"], user_id=user_id).first()
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)

    if booking.status not in ("pending",):
        return error_response("STATE_ERROR", "Only pending bookings can be paid", 409)

    payment = Payment.query.filter_by(booking_id=booking.id).first()
    if payment is None:
        payment = Payment(
            booking_id=booking.id,
            amount=booking.total_price,
            payment_method=payload.get("payment_method", "credit_card"),
            status="pending",
            transaction_id=str(uuid.uuid4()),
        )
        db.session.add(payment)

    payment.status = "success"
    booking.status = "confirmed"
    db.session.commit()

    return success_response({"payment": payment.to_dict(), "booking": booking.to_dict()})


@payments_bp.post("/simulate")
@jwt_required()
def simulate_payment_alias():
    return initiate_payment()


@payments_bp.get("/<int:payment_id>")
@jwt_required()
def get_payment(payment_id: int):
    user_id = int(get_jwt_identity())
    claims = get_jwt()

    payment = Payment.query.get(payment_id)
    if payment is None:
        return error_response("NOT_FOUND", "Payment not found", 404)

    booking = Booking.query.get(payment.booking_id)
    if booking is None:
        return error_response("NOT_FOUND", "Booking not found", 404)

    if booking.user_id != user_id and claims.get("role") != "admin":
        return error_response("FORBIDDEN", "You cannot access this payment", 403)

    return success_response({"payment": payment.to_dict()})


@payments_bp.post("/refund/<int:payment_id>")
@jwt_required()
@role_required("admin")
def refund_payment(payment_id: int):
    payload, error = validate_or_400(PaymentRefundSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    payment = Payment.query.get(payment_id)
    if payment is None:
        return error_response("NOT_FOUND", "Payment not found", 404)

    if payment.status != "success":
        return error_response("STATE_ERROR", "Only successful payments can be refunded", 409)

    payment.status = "refunded"
    db.session.commit()

    return success_response(
        {
            "payment": payment.to_dict(),
            "refund": {
                "reason": payload.get("reason"),
                "refunded_at": payment.updated_at.isoformat(),
            },
        }
    )


@payments_bp.get("/invoice/<int:booking_id>")
@jwt_required()
def get_invoice(booking_id: int):
    user_id = int(get_jwt_identity())
    booking = Booking.query.filter(Booking.id == booking_id, Booking.user_id == user_id, Booking.status == "completed").first()
    if booking is None:
        return error_response("NOT_FOUND", "Completed booking not found", 404)

    payment = Payment.query.filter_by(booking_id=booking_id).first()
    if payment is None:
        return error_response("NOT_FOUND", "Payment not found", 404)

    invoice = {
        "booking_id": booking.id,
        "vehicle": booking.vehicle.to_dict() if booking.vehicle else None,
        "user": booking.user.to_dict() if booking.user else None,
        "pickup_time": booking.pickup_time.isoformat(),
        "return_time": booking.return_time.isoformat(),
        "total_price": float(booking.total_price),
        "payment_method": payment.payment_method,
        "transaction_id": payment.transaction_id,
        "invoice_date": payment.created_at.isoformat(),
    }
    return success_response({"invoice": invoice})
