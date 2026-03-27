from flask import g, jsonify


def success_response(data=None, status_code: int = 200, meta=None):
    payload = {
        "success": True,
        "data": data if data is not None else {},
        "request_id": getattr(g, "request_id", None),
    }
    if meta is not None:
        payload["meta"] = meta
    return jsonify(payload), status_code


def error_response(code: str, message: str, status_code: int, details=None):
    payload = {
        "error": {
            "code": code,
            "message": message,
            "details": details or [],
            "request_id": getattr(g, "request_id", None),
        }
    }
    return jsonify(payload), status_code
