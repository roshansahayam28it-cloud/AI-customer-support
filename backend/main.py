from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.notification import (
    router as notification_router
)
from core.database import Base, engine

from models.user import User
from models.password_reset_otp import PasswordResetOTP

# NEW MODELS
from models.customer import Customer
from models.ticket import Ticket
from routers import ticket_reply


from routers.auth import router as auth_router
from routers.ai import router as ai_router
from routers.chat import router as chat_router
from routers.users import (
    router as users_router
)
# NEW ROUTERS
from routers.customer import router as customer_router
from routers.ticket import router as ticket_router
from routers.analytics import (
    router as analytics_router
)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTERS
app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(chat_router)

# NEW ROUTERS
app.include_router(customer_router)
app.include_router(ticket_router)
app.include_router(
    analytics_router
)
app.include_router(
    notification_router
)
app.include_router(
    ticket_reply.router
)
app.include_router(
    users_router
)
@app.get("/")
def home():
    return {
        "message": "AI Customer Support API Running"
    }