from marshmallow import ValidationError

from .responses import error_response


def validate_or_400(schema, payload):
    try:
        return schema.load(payload), None
    except ValidationError as err:
        details = [{"field": k, "issue": ", ".join(v)} for k, v in err.messages.items()]
        return None, error_response(
            code="VALIDATION_ERROR",
            message="Request validation failed",
            status_code=400,
            details=details,
        )
