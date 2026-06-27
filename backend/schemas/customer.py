from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field


class CustomerCreate(BaseModel):

    name: str

    email: EmailStr

    phone: str = Field(
        min_length=10,
        max_length=10
    )

    status: str


class CustomerResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    phone: str

    status: str

    class Config:
        from_attributes = True