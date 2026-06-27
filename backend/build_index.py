from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
import re

MODEL_NAME = "all-MiniLM-L6-v2"

print("Loading model...")

model = SentenceTransformer(MODEL_NAME)

# ==========================
# LOAD KNOWLEDGE FILE
# ==========================

with open(
    "knowledge_clean.txt",
    "r",
    encoding="utf-8"
) as f:

    text = f.read()

# ==========================
# CLEAN TEXT
# ==========================

text = text.replace("\n", " ")
text = re.sub(r"\s+", " ", text)

# ==========================
# SPLIT INTO SENTENCES
# ==========================

sentences = re.split(
    r'(?<=[.!?])\s+',
    text
)

# ==========================
# CHUNKING
# ==========================

documents = []

chunk = ""

MAX_CHUNK_SIZE = 500

for sentence in sentences:

    if len(chunk) + len(sentence) < MAX_CHUNK_SIZE:

        chunk += " " + sentence

    else:

        documents.append(
            chunk.strip()
        )

        chunk = sentence

if chunk:

    documents.append(
        chunk.strip()
    )

print("Documents Created:", len(documents))

# ==========================
# CREATE EMBEDDINGS
# ==========================

embeddings = model.encode(
    documents,
    convert_to_numpy=True,
    show_progress_bar=True
).astype("float32")

print("Embedding Shape:", embeddings.shape)

# ==========================
# NORMALIZE
# ==========================

faiss.normalize_L2(
    embeddings
)

# ==========================
# CREATE FAISS INDEX
# ==========================

dimension = embeddings.shape[1]

index = faiss.IndexFlatIP(
    dimension
)

index.add(
    embeddings
)

# ==========================
# SAVE INDEX
# ==========================

faiss.write_index(
    index,
    "faiss_index.bin"
)

# ==========================
# SAVE DOCUMENTS
# ==========================

with open(
    "faiss_docs.pkl",
    "wb"
) as f:

    pickle.dump(
        documents,
        f
    )

print("FAISS index created.")
print("Documents:", len(documents))