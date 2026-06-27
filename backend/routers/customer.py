from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from core.database import get_db

from models.customer import Customer
from models.ticket import Ticket

from schemas.customer import (
    CustomerCreate
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get("/")
def get_customers(
    db: Session = Depends(get_db)
):
    return db.query(Customer).all()


@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = db.query(
        Customer
    ).filter(
        Customer.email == customer.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_customer = Customer(
        **customer.model_dump()
    )

    db.add(new_customer)

    db.commit()

    db.refresh(new_customer)

    return new_customer


@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = db.query(
        Customer
    ).filter(
        Customer.id == customer_id
    ).first()

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    existing_customer.name = customer.name
    existing_customer.email = customer.email
    existing_customer.phone = customer.phone
    existing_customer.status = customer.status

    db.commit()

    db.refresh(existing_customer)

    return existing_customer


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = db.query(
        Customer
    ).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # Delete all tickets related to this customer
    db.query(Ticket).filter(
        Ticket.customer_id == customer_id
    ).delete()

    # Delete customer
    db.delete(customer)

    db.commit()

    return {
        "message":
        "Customer and related tickets deleted successfully"
    }