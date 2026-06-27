# models/chat_history.py

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from core.database import Base


class ChatHistory(Base):

    __tablename__ = "chat_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    message = Column(Text)

    response = Column(Text)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )