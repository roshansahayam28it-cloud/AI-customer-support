from pydantic import BaseModel


class TicketCreate(BaseModel):

    customer_id: int
    category: str
    issue: str
    priority: str
    status: str
    assigned_agent: str | None = None


class TicketResponse(BaseModel):

    id: int
    customer_id: int
    category: str
    issue: str
    priority: str
    status: str
    assigned_agent: str | None = None

    class Config:
        from_attributes = True