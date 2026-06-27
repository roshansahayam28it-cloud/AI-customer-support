from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from core.database import get_db

from models.ticket_reply import TicketReply

router = APIRouter(
    prefix="/replies",
    tags=["Replies"]
)


@router.post("/")
def create_reply(
    data: dict,
    db: Session = Depends(get_db)
):

    reply = TicketReply(
        ticket_id=data["ticket_id"],
        sender=data["sender"],
        message=data["message"]
    )

    db.add(reply)

    db.commit()

    db.refresh(reply)

    return reply


@router.get("/{ticket_id}")
def get_replies(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(TicketReply)
        .filter(
            TicketReply.ticket_id == ticket_id
        )
        .all()
    )