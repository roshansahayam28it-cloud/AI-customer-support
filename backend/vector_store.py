import os
import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"
INDEX_FILE = "faiss_index.bin"
DOCS_FILE = "faiss_docs.pkl"

print("Loading embedding model...")

embedding_model = SentenceTransformer(
    MODEL_NAME
)

# ==========================
# LOAD INDEX
# ==========================

if os.path.exists(INDEX_FILE):

    index = faiss.read_index(
        INDEX_FILE
    )

else:

    index = None

# ==========================
# LOAD DOCUMENTS
# ==========================

if os.path.exists(DOCS_FILE):

    with open(
        DOCS_FILE,
        "rb"
    ) as f:

        documents = pickle.load(f)

else:

    documents = []

# ==========================
# SEARCH FUNCTION
# ==========================

def search_documents(
    query: str,
    top_k: int = 5,
    min_score: float = 0.35
):

    if index is None or not documents:
        return []

    query_embedding = embedding_model.encode(
        [query],
        convert_to_numpy=True
    ).astype("float32")

    faiss.normalize_L2(
        query_embedding
    )

    distances, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    import re

    query_words = re.findall(r"\w+",query.lower())

    for score, idx in zip(
        distances[0],
        indices[0]
    ):

        if idx == -1:
            continue

        if float(score) >= min_score:

            text = documents[idx]

            match_count = 0

            for word in query_words:

                if word in text.lower():
                    match_count += 1

            results.append({
                "text": text,
                "score": float(score),
                "match": match_count
            })

    # ==========================
    # RERANK RESULTS
    # ==========================

    results.sort(
        key=lambda x: (
            x["match"],
            x["score"]
        ),
        reverse=True
    )

    return results