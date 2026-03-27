from marshmallow import Schema, fields, validate


class BookingEstimateSchema(Schema):
    vehicle_id = fields.Int(required=True)
    pickup_time = fields.DateTime(required=True)
    return_time = fields.DateTime(required=True)
    coupon_code = fields.Str(required=False, allow_none=True, validate=validate.Length(min=2, max=100))


class BookingCreateSchema(BookingEstimateSchema):
    pickup_location = fields.Str(required=True, validate=validate.Length(min=2, max=200))


class BookingListQuerySchema(Schema):
    status = fields.Str(required=False)
    page = fields.Int(required=False)
    per_page = fields.Int(required=False)


class BookingStatusUpdateSchema(Schema):
    status = fields.Str(
        required=True,
        validate=validate.OneOf(["pending", "confirmed", "active", "completed", "canceled"]),
    )


class BookingExtendSchema(Schema):
    return_time = fields.DateTime(required=True)
    coupon_code = fields.Str(required=False, allow_none=True, validate=validate.Length(min=2, max=100))
