from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from core.database import get_db

from models.customer import Customer
from models.ticket import Ticket

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_notifications(
    db: Session = Depends(get_db)
):

    notifications = []

    customers = (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .limit(5)
        .all()
    )

    tickets = (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .limit(5)
        .all()
    )

    for customer in customers:
        notifications.append({
            "message":
            f'Customer "{customer.name}" added'
        })

    for ticket in tickets:
        notifications.append({
            "message":
            f"Ticket #{ticket.id} created"
        })

    return notifications[:10]