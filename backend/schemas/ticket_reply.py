from pydantic import BaseModel


class TicketReplyCreate(BaseModel):
    ticket_id: int
    sender: str
    message: str


class TicketReplyResponse(BaseModel):
    id: int
    ticket_id: int
    sender: str
    message: str

    class Config:
        from_attributes = True