from marshmallow import Schema, fields, validate


class ReviewCreateSchema(Schema):
    booking_id = fields.Int(required=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(required=False, allow_none=True, validate=validate.Length(max=1000))
