from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from core.database import Base


class Customer(Base):

    __tablename__ = "customers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100)
    )

    email = Column(
        String(100),
        unique=True
    )

    phone = Column(
        String(20)
    )

    status = Column(
        String(20)
    )