from fastapi import APIRouter

from vector_store import search_documents
from groq_client import ask_groq

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


@router.post("/")
async def chat(data: dict):

    user_message = data.get(
        "message",
        ""
    ).strip()

    if not user_message:

        return {
            "reply":
            "Please enter a message."
        }

    # ==========================
    # SEARCH RAG
    # ==========================

    rag_results = search_documents(
        user_message,
        top_k=10,
        min_score=0.20
    )
    print("\nQUESTION:", user_message)

    for item in rag_results:
        print(item["score"])
        print(item["text"])
        print("----------------")
    # ==========================
    # RAG FOUND
    # ==========================

    if len(rag_results) > 0:

        rag_context = "\n\n".join(
            [
                item["text"]
                for item in rag_results
            ]
        )

        prompt = f"""
You are the official LICET AI assistant.

You must answer ONLY from the knowledge provided below.

Rules:
- Use only the knowledge.
- If the answer exists, answer confidently.
- If the answer is partially available, use the available information.
- Never invent facts.
- Only say "I don't know." when the answer is completely missing.

Knowledge:
{rag_context}

User Question:
{user_message}

Answer:
"""

        reply = ask_groq(
            prompt
        )

        return {
            "reply":
            reply
        }

    # ==========================
    # NO RAG RESULT
    # ==========================

    prompt = f"""
You are a friendly AI assistant.

Answer the user's question naturally.

Question:
{user_message}
"""

    reply = ask_groq(
        prompt
    )

    return {
        "reply":
        reply
    }

