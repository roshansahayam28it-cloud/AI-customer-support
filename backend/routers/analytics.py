from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from core.database import get_db

from models.customer import Customer
from models.ticket import Ticket

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db)
):

    total_customers = db.query(
        Customer
    ).count()

    total_tickets = db.query(
        Ticket
    ).count()

    open_tickets = db.query(
        Ticket
    ).filter(
        Ticket.status == "Open"
    ).count()

    resolved_tickets = db.query(
        Ticket
    ).filter(
        Ticket.status == "Resolved"
    ).count()

    return {
        "total_customers":
            total_customers,

        "total_tickets":
            total_tickets,

        "open_tickets":
            open_tickets,

        "resolved_tickets":
            resolved_tickets,

        "ai_conversations":
            0
    }