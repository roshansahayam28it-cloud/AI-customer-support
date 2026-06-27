from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from core.database import Base


class TicketReply(Base):

    __tablename__ = "ticket_replies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    ticket_id = Column(
        Integer,
        ForeignKey("tickets.id")
    )

    sender = Column(
        String(50)
    )

    message = Column(
        Text
    )