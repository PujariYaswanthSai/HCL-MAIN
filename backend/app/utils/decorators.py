import time
from collections import defaultdict, deque
from functools import wraps

from flask_jwt_extended import get_jwt

from .responses import error_response


_RATE_LIMIT_STORE = defaultdict(deque)


def role_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") not in roles:
                return error_response(
                    code="FORBIDDEN",
                    message="Insufficient permissions",
                    status_code=403,
                )
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def rate_limit(max_calls: int = 60, period_seconds: int = 60):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            now = time.time()
            key = f"{fn.__name__}:{kwargs.get('user_id', 'anonymous')}"
            bucket = _RATE_LIMIT_STORE[key]

            while bucket and now - bucket[0] > period_seconds:
                bucket.popleft()

            if len(bucket) >= max_calls:
                return error_response(
                    code="RATE_LIMITED",
                    message="Too many requests. Please retry later.",
                    status_code=429,
                )

            bucket.append(now)
            return fn(*args, **kwargs)

        return wrapper

    return decorator
