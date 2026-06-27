from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)

from datetime import datetime

from core.database import Base


class PasswordResetOTP(Base):

    __tablename__ = "password_reset_otps"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(String(100))

    otp = Column(String(6))

    expires_at = Column(DateTime)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )