from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from core.database import get_db

from models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/agents")
def get_agents(
    db: Session = Depends(get_db)
):

    return db.query(
        User
    ).filter(
        User.role == "Agent"
    ).all()