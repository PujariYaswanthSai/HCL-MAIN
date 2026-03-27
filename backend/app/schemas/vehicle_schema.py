from marshmallow import Schema, fields, validate


class VehicleCreateSchema(Schema):
    category_id = fields.Int(required=True)
    registration_number = fields.Str(required=True, validate=validate.Length(min=3, max=20))
    make = fields.Str(required=True, validate=validate.Length(min=1, max=80))
    model = fields.Str(required=True, validate=validate.Length(min=1, max=80))
    year = fields.Int(required=False, allow_none=True)
    fuel_type = fields.Str(required=False, allow_none=True)
    seating_capacity = fields.Int(required=False, allow_none=True)
    image_url = fields.Str(required=False, allow_none=True)


class VehicleUpdateSchema(Schema):
    category_id = fields.Int(required=False)
    registration_number = fields.Str(required=False, validate=validate.Length(min=3, max=20))
    make = fields.Str(required=False, validate=validate.Length(min=1, max=80))
    model = fields.Str(required=False, validate=validate.Length(min=1, max=80))
    year = fields.Int(required=False, allow_none=True)
    fuel_type = fields.Str(required=False, allow_none=True)
    seating_capacity = fields.Int(required=False, allow_none=True)
    status = fields.Str(required=False, validate=validate.OneOf(["available", "booked", "maintenance"]))
    image_url = fields.Str(required=False, allow_none=True)
    is_active = fields.Bool(required=False)


class VehicleAvailabilityQuerySchema(Schema):
    pickup_time = fields.DateTime(required=True)
    return_time = fields.DateTime(required=True)


class VehicleListQuerySchema(Schema):
    category_id = fields.Int(required=False)
    fuel_type = fields.Str(required=False)
    seats = fields.Int(required=False)
    status = fields.Str(required=False)
    page = fields.Int(required=False)
    per_page = fields.Int(required=False)
