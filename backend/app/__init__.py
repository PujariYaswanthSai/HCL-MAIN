import logging
import time
import uuid

from flask import Flask, g, request
from flask_jwt_extended import JWTManager

from config import CONFIG_MAP
from .blueprints.admin_bp import admin_bp
from .blueprints.auth_bp import auth_bp
from .blueprints.bookings_bp import bookings_bp
from .blueprints.maintenance_bp import maintenance_bp
from .blueprints.payments_bp import payments_bp
from .blueprints.pricing_bp import pricing_bp
from .blueprints.reviews_bp import reviews_bp
from .blueprints.vehicles_bp import vehicles_bp
from .extensions import cors, db, jwt, migrate


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vehicle-rental-api")


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(CONFIG_MAP.get(config_name, CONFIG_MAP["development"]))

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(vehicles_bp, url_prefix="/api/vehicles")
    app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    app.register_blueprint(maintenance_bp, url_prefix="/api/maintenance")
    app.register_blueprint(pricing_bp, url_prefix="/api/pricing")
    app.register_blueprint(reviews_bp, url_prefix="/api/reviews")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.before_request
    def attach_request_context() -> None:
        g.request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))
        g.request_started_at = time.perf_counter()

    @app.after_request
    def log_request(response):
        duration_ms = int((time.perf_counter() - g.request_started_at) * 1000)
        response.headers["X-Request-Id"] = g.request_id
        logger.info(
            "method=%s path=%s status=%s duration_ms=%s request_id=%s",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
            g.request_id,
        )
        return response

    return app
