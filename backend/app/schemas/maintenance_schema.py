from marshmallow import Schema, fields, validate


class MaintenanceCreateSchema(Schema):
    vehicle_id = fields.Int(required=True)
    description = fields.Str(required=True, validate=validate.Length(min=5))
    scheduled_date = fields.DateTime(required=False, allow_none=True)
    cost = fields.Decimal(required=False, allow_none=True)


class MaintenanceUpdateSchema(Schema):
    description = fields.Str(required=False)
    scheduled_date = fields.DateTime(required=False, allow_none=True)
    status = fields.Str(required=False, validate=validate.OneOf(["scheduled", "in_progress", "completed"]))
    completion_date = fields.DateTime(required=False, allow_none=True)
    cost = fields.Decimal(required=False, allow_none=True)
