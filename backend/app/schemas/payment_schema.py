from marshmallow import Schema, fields, validate


class PaymentSchema(Schema):
    booking_id = fields.Int(required=True)
    amount = fields.Decimal(required=True)
    payment_method = fields.Str(required=False, allow_none=True)


class PaymentStatusSchema(Schema):
    status = fields.Str(required=True, validate=validate.OneOf(["pending", "success", "failed"]))
    transaction_id = fields.Str(required=False, allow_none=True)


class PaymentRefundSchema(Schema):
    reason = fields.Str(required=False, allow_none=True, validate=validate.Length(max=300))
