from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from core.database import Base


class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id")
    )

    category = Column(
        String(50)
    )

    issue = Column(Text)

    priority = Column(
        String(20)
    )

    status = Column(
        String(20)
    )

    assigned_agent = Column(
        String(100),
        nullable=True
    )