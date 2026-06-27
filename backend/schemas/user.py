from pydantic import (
    BaseModel,
    EmailStr
)


class UserRegister(BaseModel):

    name: str
    email: EmailStr
    password: str
    role: str


class UserLogin(BaseModel):

    email: EmailStr
    password: str


class VerifyOTPRequest(BaseModel):

    email: EmailStr
    otp: str


class ResetPasswordRequest(BaseModel):

    email: EmailStr
    new_password: str


class UserResponse(BaseModel):

    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True