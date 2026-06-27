import email
import re
from fastapi import APIRouter
from models.user import User
from vector_store import search_documents
from groq_client import ask_groq
from core.database import SessionLocal
from models.customer import Customer
from models.ticket import Ticket
import re
from sqlalchemy import func
router = APIRouter(
    prefix="/chat",
    tags=["AI"]
)

# ======================
# TEMPORARY MEMORY
# ======================

pending_confirmations = {}
pending_tickets = {}

def admin_chat(user_message: str, admin_email: str):

    db = SessionLocal()

    message = user_message.lower().strip()

    # ===============================
    # OPEN TICKETS
    # ===============================

    if "open ticket" in message:

        count = (
            db.query(Ticket)
            .filter(Ticket.status == "Open")
            .count()
        )

        db.close()

        return f"📌 There are {count} open tickets."

    # ===============================
    # RESOLVED TICKETS
    # ===============================

    if "resolved ticket" in message:

        count = (
            db.query(Ticket)
            .filter(Ticket.status == "Resolved")
            .count()
        )

        db.close()

        return f"✅ There are {count} resolved tickets."

    # ===============================
    # TOTAL TICKETS
    # ===============================

    if "total ticket" in message:

        count = db.query(Ticket).count()

        db.close()

        return f"🎫 Total Tickets : {count}"

    # ===============================
    # TOTAL CUSTOMERS
    # ===============================

    if "customer" in message and "total" in message:

        count = db.query(Customer).count()

        db.close()

        return f"👤 Total Customers : {count}"

    # ===============================
    # SHOW AGENTS
    # ===============================

    if "show agent" in message or "list agent" in message:

        agents = (
            db.query(User)
            .filter(User.role == "Agent")
            .all()
        )

        if not agents:

            db.close()

            return "No agents found."

        text = "👨‍💻 Agents\n\n"

        for agent in agents:

            text += (
                f"Name : {agent.name}\n"
                f"Email : {agent.email}\n\n"
            )

        db.close()

        return text

    # ===============================
    # UNRESOLVED TICKETS
    # ===============================

    if (
        "unresolved" in message
        or
        "pending ticket" in message
    ):

        tickets = (
            db.query(Ticket)
            .filter(Ticket.status != "Resolved")
            .all()
        )

        if not tickets:

            db.close()

            return "No unresolved tickets."

        reply = "📋 Unresolved Tickets\n\n"

        for ticket in tickets:

            reply += (
                f"Ticket #{ticket.id}\n"
                f"Status : {ticket.status}\n"
                f"Priority : {ticket.priority}\n"
                f"Assigned : {ticket.assigned_agent}\n\n"
            )

        db.close()

        return reply

    # ===============================
    # CUSTOMER HISTORY
    # ===============================

    email_match = re.search(
        r'[\w\.-]+@[\w\.-]+\.\w+',
        message
    )

    if email_match:

        customer_email = email_match.group()

        customer = (
            db.query(Customer)
            .filter(
                Customer.email == customer_email
            )
            .first()
        )

        if customer:

            tickets = (
                db.query(Ticket)
                .filter(
                    Ticket.customer_id == customer.id
                )
                .all()
            )

            text = f"""
Customer

Name : {customer.name}

Email : {customer.email}

Phone : {customer.phone}

Status : {customer.status}

Total Tickets : {len(tickets)}

"""

            for t in tickets:

                text += (
                    f"Ticket #{t.id} | "
                    f"{t.status} | "
                    f"{t.priority}\n"
                )

            db.close()

            return text
            # ===============================
    # AGENT PERFORMANCE
    # ===============================

    if (
        "agent performance" in message
        or
        "assigned tickets" in message
    ):

        agents = (
            db.query(User)
            .filter(User.role == "Agent")
            .all()
        )

        if not agents:

            db.close()

            return "No agents found."

        text = "📊 Agent Performance\n\n"

        for agent in agents:

            total = (
                db.query(Ticket)
                .filter(
                    Ticket.assigned_agent == agent.email
                )
                .count()
            )

            resolved = (
                db.query(Ticket)
                .filter(
                    Ticket.assigned_agent == agent.email,
                    Ticket.status == "Resolved"
                )
                .count()
            )

            open_tickets = (
                db.query(Ticket)
                .filter(
                    Ticket.assigned_agent == agent.email,
                    Ticket.status == "Open"
                )
                .count()
            )

            text += (
                f"{agent.name}\n"
                f"Assigned : {total}\n"
                f"Open : {open_tickets}\n"
                f"Resolved : {resolved}\n\n"
            )

        db.close()

        return text

    # ===============================
    # SEARCH TICKET
    # ===============================

    match = re.search(
        r"ticket(?:\s*(?:#|no|number)?\s*)(\d+)",
        message
    )

    if match:

        ticket_id = int(match.group(1))

        ticket = (
            db.query(Ticket)
            .filter(Ticket.id == ticket_id)
            .first()
        )

        if not ticket:

            db.close()

            return "Ticket not found."

        customer = (
            db.query(Customer)
            .filter(
                Customer.id == ticket.customer_id
            )
            .first()
        )

        customer_name = (
            customer.name
            if customer
            else "Unknown"
        )

        customer_email = (
            customer.email
            if customer
            else "Unknown"
        )

        db.close()

        return f"""
🎫 Ticket #{ticket.id}

Customer : {customer_name}

Email : {customer_email}

Category : {ticket.category}

Issue :
{ticket.issue}

Priority : {ticket.priority}

Status : {ticket.status}

Assigned Agent :
{ticket.assigned_agent}
"""

    # ===============================
    # DAILY REPORT
    # ===============================

    if (
        "report" in message
        or
        "analytics" in message
        or
        "dashboard" in message
    ):

        total_customers = (
            db.query(Customer).count()
        )

        total_tickets = (
            db.query(Ticket).count()
        )

        open_count = (
            db.query(Ticket)
            .filter(
                Ticket.status == "Open"
            )
            .count()
        )

        resolved_count = (
            db.query(Ticket)
            .filter(
                Ticket.status == "Resolved"
            )
            .count()
        )

        agents = (
            db.query(User)
            .filter(
                User.role == "Agent"
            )
            .count()
        )

        db.close()

        return f"""
📊 SUPPORT REPORT

👤 Customers : {total_customers}

🎫 Tickets : {total_tickets}

🟢 Open : {open_count}

✅ Resolved : {resolved_count}

👨‍💻 Agents : {agents}
"""

    # ===============================
    # NORMAL ADMIN AI
    # ===============================

    db.close()

    prompt = f"""
You are an AI assistant for the ADMIN of a Customer Support System.

The user is an ADMIN.

Help with:

• Ticket management
• Analytics
• Reports
• Customer management
• Agent management
• Support process improvement

Never invent database values.

If the question needs database information, ask the admin to use one of the supported commands.

Admin Request:

{user_message}

Answer professionally.
"""

    try:

        return ask_groq(prompt)

    except Exception:

        return "Unable to connect to Admin AI."
        

def agent_chat(user_message: str):

    db = SessionLocal()

    message = user_message.lower().strip()

    # ==========================
    # FIND TICKET NUMBER
    # ==========================

    match = re.search(
        r"ticket(?:\s*(?:#|no|number)?\s*)(\d+)",
        message
        )   

    if match:

        ticket_id = int(match.group(1))

        ticket = (
            db.query(Ticket)
            .filter(Ticket.id == ticket_id)
            .first()
        )

        if not ticket:

            db.close()

            return f"❌ Ticket #{ticket_id} was not found."

        customer = (
            db.query(Customer)
            .filter(
                Customer.id == ticket.customer_id
            )
            .first()
        )

        customer_name = (
            customer.name
            if customer
            else "Unknown"
        )

        customer_email = (
            customer.email
            if customer
            else "Unknown"
        )

        ticket_information = f"""
Ticket ID:
{ticket.id}

Customer:
{customer_name}

Customer Email:
{customer_email}

Category:
{ticket.category}

Issue:
{ticket.issue}

Priority:
{ticket.priority}

Status:
{ticket.status}

Assigned Agent:
{ticket.assigned_agent}
"""

        # ==========================
        # DESCRIBE
        # ==========================

        if (
            "describe" in message
            or
            "explain" in message
        ):

            prompt = f"""
You are an AI assistant helping a support agent.

Explain the following support ticket clearly.

{ticket_information}

Explain:

1. What happened?

2. What problem is the customer facing?

3. How serious is it?

4. What should the agent do next?
"""

            reply = ask_groq(prompt)

            db.close()

            return reply

        # ==========================
        # SUMMARIZE
        # ==========================

        if "summarize" in message:

            prompt = f"""
You are an AI support assistant.

Summarize this support ticket in less than 120 words.

{ticket_information}
"""

            reply = ask_groq(prompt)

            db.close()

            return reply
                # ==========================
        # GENERATE CUSTOMER REPLY
        # ==========================

        if (
            "reply" in message
            or
            "respond" in message
        ):

            prompt = f"""
You are an experienced Customer Support Agent.

Generate a professional reply to the customer.

Ticket Information:

{ticket_information}

Rules:
- Be polite.
- Apologize if necessary.
- Explain what the team will do.
- End professionally.
"""

            reply = ask_groq(prompt)

            db.close()

            return reply

        # ==========================
        # INTERNAL NOTE
        # ==========================

        if (
            "internal" in message
            or
            "note" in message
        ):

            prompt = f"""
You are writing an INTERNAL SUPPORT NOTE.

Ticket:

{ticket_information}

Write an internal note.

Do not address the customer.

Mention:
- Root cause
- Investigation
- Next action
"""

            reply = ask_groq(prompt)

            db.close()

            return reply

        # ==========================
        # SUGGEST SOLUTION
        # ==========================

        if (
            "solution" in message
            or
            "solve" in message
            or
            "fix" in message
        ):

            prompt = f"""
You are a senior technical support engineer.

Ticket:

{ticket_information}

Suggest the best solution.

Explain:

1. Root cause

2. Resolution

3. Recommended next action
"""

            reply = ask_groq(prompt)

            db.close()

            return reply

        # ==========================
        # DEFAULT TICKET DETAILS
        # ==========================

        db.close()

        return f"""
Ticket #{ticket.id}

Customer : {customer_name}
Email    : {customer_email}
Category : {ticket.category}
Priority : {ticket.priority}
Status   : {ticket.status}

Issue:
{ticket.issue}
"""

    # ==========================
    # NORMAL AGENT AI
    # ==========================

    db.close()

    prompt = f"""
You are an AI assistant for Customer Support Agents.

The user is a SUPPORT AGENT.

Help them with:

• Customer support
• Ticket handling
• Email writing
• Professional replies
• Technical explanations
• Internal notes

Never create tickets.

Agent Request:

{user_message}

Answer professionally.
"""

    try:

        return ask_groq(prompt)

    except Exception:

        return "Unable to connect to Agent AI."

@router.post("/")
async def chat(data: dict):

    user_message = data["message"]
    email = data.get("email", "guest")
    role = data.get("role", "Customer")
    # ======================
    # AGENT AI ASSISTANT
    # ======================

    if role == "Agent":

        return {
            "reply": agent_chat(
                user_message,
                email
                )
        }

    if role == "Admin":

        return {
            "reply": admin_chat(
                user_message,
                email
                )
        }

    # ======================
    # YES / NO TICKET
    # ======================

    if email in pending_confirmations:

        answer = user_message.lower().strip()
        print(answer)

        if answer == "yes":

            original_message = pending_confirmations[email]

            prompt = f"""
A customer reported:

{original_message}

Generate exactly 3 support questions.

Rules:
- One question per line.
- Do not number the questions.
- Ask only important questions.
"""

            response = ask_groq(prompt)

            questions = [
                q.strip()
                for q in response.split("\n")
                if q.strip()
            ]

            pending_tickets[email] = {
                "questions": questions,
                "step": 0,
                "answers": [],
                "issue": original_message,
                "email": email
            }

            del pending_confirmations[email]

            return {
                "reply":
                questions[0]
            }

        if answer == "no":

            del pending_confirmations[email]

            return {
                "reply":
                "Okay. What's next?"
            }

        return {
            "reply":
            "Please reply YES or NO."
        }

    # ======================
    # TICKET QUESTIONS
    # ======================

    if email in pending_tickets:

        ticket = pending_tickets[email]

        current_step = ticket["step"]

        question = ticket["questions"][current_step]

        validation_prompt = f"""
You are validating a customer's answer.

Question:
{question}

Customer Answer:
{user_message}

Instructions:
- The customer answer does NOT need to exactly match the wording of the question.
- The answer may be short or long.
- Accept paraphrased answers.
- Accept natural language answers.
- Accept yes/no answers if the question can be answered by yes or no.
- Reject only completely unrelated, random, meaningless, or nonsense answers.

Examples:

Question:
Have you checked your account balance?
Answer:
Yes, I have enough balance.
YES

Question:
Have you retried the payment?
Answer:
No.
YES

Question:
What payment method did you use?
Answer:
UPI
YES

Question:
What payment method did you use?
Answer:
asdfgh
NO

Question:
What error message did you receive?
Answer:
Transaction failed.
YES

Question:
What is your student ID?
Answer:
22IT045
YES

Question:
What is your student ID?
Answer:
hello
NO

Reply ONLY YES or NO.
"""

        validation = ask_groq(
            validation_prompt
        )

        if "no" in validation.lower():

            return {
                "reply":
                f"Please provide a valid answer for:\n\n{question}"
            }

        ticket["answers"].append(
            user_message
        )

        ticket["step"] += 1

        if ticket["step"] < len(ticket["questions"]):

            return {
                "reply":
                ticket["questions"][
                    ticket["step"]
                ]
            }

        answers = "\n".join(
            ticket["answers"]
        )

        db = SessionLocal()

        customer = (
            db.query(Customer)
            .filter(Customer.email == email)
            .first()
        )

        new_ticket = Ticket(
            customer_id=customer.id,
            category="AI Generated",
            issue=f"{ticket['issue']}\n\n{answers}",
            priority="Medium",
            status="Open"
        )

        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)

        ticket_id = new_ticket.id

        db.close()

        del pending_tickets[email]

        return {
            "reply":
            f"Ticket created successfully.\n\n"
            f"Ticket ID: {ticket_id}\n"
            f"Status: Open"
        }

    # ======================
    # SEARCH RAG
    # ======================

    results = search_documents(
        user_message,
        top_k=3
    )

    print("\nQUESTION:", user_message)

    for item in results:
        print(item["text"])
        print("----------------")

    # ======================
    # NO DATA FOUND
    # ======================

    if len(results) == 0:

        prompt = f"""
You are a LICET AI assistant.

Rules:

1. If the user greets you, respond politely.
   Examples:
   - hi
   - hello
   - hlo
   - hey
   - good morning
   - good evening
   - bye

2. If the question is unrelated to LICET knowledge or requires support assistance, reply ONLY:

I don't know.

3. Do not give general advice.
4. Do not troubleshoot problems.
5. Do not ask follow-up questions.
6. Do not answer issues related to:
   - payment
   - fee
   - login
   - attendance
   - hostel
   - ERP
   - scholarship
   - technical support

User:
{user_message}
"""

        reply = ask_groq(prompt)

        if "i don't know" in reply.lower():

            pending_confirmations[email] = user_message
            print(pending_confirmations[email])

            return {
                "reply":
                "I couldn't find the answer.\n\n"
                "Would you like to create a support ticket?\n\n"
                "Reply YES or NO."
            }

        return {
            "reply": reply
        }

    # ======================
    # BUILD CONTEXT
    # ======================

    context = "\n\n".join(
        [item["text"] for item in results]
    )

    # ======================
    # CREATE PROMPT
    # ======================

    prompt = f"""
You are a LICET college assistant.

Answer ONLY from the knowledge below.

Rules:
- Use only the knowledge.
- Do not invent information.
- If the answer does not exist, reply:
I don't know.

Knowledge:
{context}

Question:
{user_message}

Answer:
"""

    # ======================
    # ASK GROQ
    # ======================

    try:

        answer = ask_groq(prompt)

        return {
            "reply": answer
        }

    except Exception as e:

        print("GROQ ERROR:", e)

        return {
            "reply":
            "Unable to connect to AI Assistant."
        }