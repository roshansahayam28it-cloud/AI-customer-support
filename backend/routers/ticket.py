from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from core.database import get_db

from models.ticket import Ticket
from models.user import User
from models.customer import Customer

from schemas.ticket import (
    TicketCreate,
    TicketResponse
)

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)


# ==========================
# GET ALL TICKETS (ADMIN)
# ==========================
@router.get("/")
def get_tickets(
    db: Session = Depends(get_db)
):
    return db.query(
        Ticket
    ).all()


# ==========================
# CREATE TICKET
# ==========================
@router.post("/")
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):
    new_ticket = Ticket(
        **ticket.model_dump()
    )

    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)

    return new_ticket


# ==========================
# UPDATE TICKET
# ==========================
@router.put("/{ticket_id}")
def update_ticket(
    ticket_id: int,
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    existing_ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )

    if not existing_ticket:
        return {
            "message":
            "Ticket not found"
        }

    existing_ticket.customer_id = ticket.customer_id
    existing_ticket.issue = ticket.issue
    existing_ticket.priority = ticket.priority
    existing_ticket.status = ticket.status

    db.commit()

    db.refresh(existing_ticket)

    return existing_ticket


# ==========================
# ASSIGN AGENT
# ==========================
@router.put("/assign/{ticket_id}")
def assign_agent(
    ticket_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.assigned_agent = data["agent"]

    db.commit()

    db.refresh(ticket)

    return {
        "message":
        "Agent Assigned Successfully"
    }


# ==========================
# AGENT TICKETS
# ==========================
@router.get("/agent/{email}")
def get_agent_tickets(
    email: str,
    db: Session = Depends(get_db)
):

    return (
        db.query(Ticket)
        .filter(
            Ticket.assigned_agent == email
        )
        .all()
    )

# ==========================
# CHANGE TICKET STATUS
# ==========================
@router.put("/status/{ticket_id}")
def change_status(
    ticket_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.status = data["status"]

    db.commit()

    db.refresh(ticket)

    return {
        "message": "Status Updated Successfully"
    }
# ==========================
# CUSTOMER TICKETS
# ==========================
@router.get("/customer/{email}")
def get_customer_tickets(
    email: str,
    db: Session = Depends(get_db)
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.email == email
        )
        .first()
    )

    if not customer:
        return []

    return (
        db.query(Ticket)
        .filter(
            Ticket.customer_id == customer.id
        )
        .all()
    )


# ==========================
# DELETE TICKET
# ==========================
@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )

    if not ticket:
        return {
            "message":
            "Ticket not found"
        }

    db.delete(ticket)

    db.commit()

    return {
        "message":
        "Ticket deleted successfully"
    }