from marshmallow import Schema, fields, validate


class PricingRuleCreateSchema(Schema):
    category_id = fields.Int(required=False, allow_none=True)
    name = fields.Str(required=True, validate=validate.Length(min=3, max=100))
    description = fields.Str(required=False, allow_none=True)
    rule_type = fields.Str(required=True, validate=validate.OneOf(["seasonal", "weekend", "peak"]))
    multiplier = fields.Decimal(required=True)
    start_date = fields.DateTime(required=False, allow_none=True)
    end_date = fields.DateTime(required=False, allow_none=True)


class PricingRuleUpdateSchema(Schema):
    name = fields.Str(required=False)
    description = fields.Str(required=False, allow_none=True)
    multiplier = fields.Decimal(required=False)
    start_date = fields.DateTime(required=False, allow_none=True)
    end_date = fields.DateTime(required=False, allow_none=True)
    is_active = fields.Bool(required=False)
