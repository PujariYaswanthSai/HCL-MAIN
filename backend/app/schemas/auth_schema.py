from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    role = fields.Str(validate=validate.OneOf(["customer", "admin", "fleet_manager"]))
    phone = fields.Str(required=False, allow_none=True)
    license_number = fields.Str(required=False, allow_none=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class UpdateProfileSchema(Schema):
    name = fields.Str(required=False, validate=validate.Length(min=2, max=100))
    phone = fields.Str(required=False, allow_none=True)
    license_number = fields.Str(required=False, allow_none=True)
