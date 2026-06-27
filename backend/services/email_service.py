from fastapi_mail import (
    FastMail,
    MessageSchema,
    ConnectionConfig
)

from core.config import *


conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_STARTTLS=MAIL_STARTTLS,
    MAIL_SSL_TLS=MAIL_SSL_TLS,
    USE_CREDENTIALS=True
)


async def send_otp_email(
    email: str,
    otp: str
):

    message = MessageSchema(
        subject="AI SUPPORTER Password Reset OTP",

        recipients=[email],

        body=f"""
Your OTP is:

{otp}

Valid for 10 minutes.
""",

        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)