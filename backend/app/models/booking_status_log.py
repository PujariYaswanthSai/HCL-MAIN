from datetime import datetime

from app.extensions import db


class BookingStatusLog(db.Model):
    __tablename__ = "booking_status_log"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.id"), nullable=False, index=True)
    old_status = db.Column(db.String(20), nullable=True)
    new_status = db.Column(db.String(20), nullable=False)
    reason = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    booking = db.relationship("Booking", backref=db.backref("status_logs", lazy="dynamic", cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "old_status": self.old_status,
            "new_status": self.new_status,
            "reason": self.reason,
            "created_at": self.created_at.isoformat(),
        }
