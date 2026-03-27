from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.booking import Booking
from app.models.review import Review
from app.schemas.review_schema import ReviewCreateSchema
from app.utils.responses import error_response, success_response
from app.utils.validators import validate_or_400

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.get("")
def list_reviews():
    vehicle_id = request.args.get("vehicle_id", type=int)
    query = Review.query
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)

    reviews = query.order_by(Review.created_at.desc()).all()
    return success_response({"reviews": [review.to_dict() for review in reviews]})


@reviews_bp.post("")
@jwt_required()
def create_review():
    user_id = int(get_jwt_identity())
    payload, error = validate_or_400(ReviewCreateSchema(), request.get_json(silent=True) or {})
    if error:
        return error

    booking = Booking.query.filter_by(id=payload["booking_id"], user_id=user_id, status="completed").first()
    if booking is None:
        return error_response(
            "STATE_ERROR",
            "Only completed bookings can be reviewed",
            409,
        )

    existing_review = Review.query.filter_by(booking_id=payload["booking_id"]).first()
    if existing_review:
        return error_response("CONFLICT", "This booking already has a review", 409)

    review = Review(
        booking_id=payload["booking_id"],
        user_id=user_id,
        vehicle_id=booking.vehicle_id,
        rating=payload["rating"],
        comment=payload.get("comment"),
    )

    db.session.add(review)
    db.session.commit()
    return success_response({"review": review.to_dict()}, 201)


@reviews_bp.get("/vehicle/<int:vehicle_id>")
def get_vehicle_reviews(vehicle_id: int):
    reviews = Review.query.filter_by(vehicle_id=vehicle_id).order_by(Review.created_at.desc()).all()

    if not reviews:
        return success_response({"reviews": [], "average_rating": 0})

    average_rating = sum(r.rating for r in reviews) / len(reviews)
    return success_response({"reviews": [r.to_dict() for r in reviews], "average_rating": round(average_rating, 2)})
