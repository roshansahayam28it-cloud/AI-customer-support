
import random
from models.customer import Customer
from datetime import (
    datetime,
    timedelta
)

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from core.database import get_db

from models.user import User
from models.password_reset_otp import PasswordResetOTP

from schemas.user import (
    UserRegister,
    UserLogin,
    VerifyOTPRequest,
    ResetPasswordRequest
)

from services.email_service import send_otp_email

from core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# -------------------------
# REGISTER
# -------------------------

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    total_users = db.query(
        User
    ).count()

    if total_users == 0:
        user_role = "Admin"
    elif total_users == 1:
        user_role = "Agent"
    else:
        user_role = "Customer"

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(
            user.password
        ),
        role=user_role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create customer record
    if user_role == "Customer":

        customer = Customer(
            name=user.name,
            email=user.email,
            phone="",
            status="Active"
        )

        db.add(customer)
        db.commit()

    return {
        "message": "Registration Successful",
        "role": user_role
    }

# -------------------------
# LOGIN
# -------------------------

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    token = create_access_token({
        "sub": db_user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "name": db_user.name,
        "email": db_user.email,
        "role": db_user.role
    }


# -------------------------
# FORGOT PASSWORD
# -------------------------

@router.post("/forgot-password")
async def forgot_password(
    data: dict,
    db: Session = Depends(get_db)
):

    email = data["email"]

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    otp = str(
        random.randint(
            100000,
            999999
        )
    )

    otp_record = PasswordResetOTP(
        email=email,
        otp=otp,
        expires_at=
        datetime.utcnow()
        + timedelta(minutes=10)
    )

    db.add(otp_record)
    db.commit()

    await send_otp_email(
        email,
        otp
    )

    return {
        "message":
        "OTP sent successfully"
    }


# -------------------------
# VERIFY OTP
# -------------------------

@router.post("/verify-otp")
def verify_otp(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):

    otp_record = db.query(
        PasswordResetOTP
    ).filter(
        PasswordResetOTP.email == data.email,
        PasswordResetOTP.otp == data.otp
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    if otp_record.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="OTP Expired"
        )

    return {
        "message":
        "OTP Verified Successfully"
    }


# -------------------------
# RESET PASSWORD
# -------------------------

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.password = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message":
        "Password Updated Successfully"
    }

