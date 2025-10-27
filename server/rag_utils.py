from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Create FAISS index (you can persist later)
dimension = 384  # embedding size for this model
index = faiss.IndexFlatL2(dimension)
stored_chunks = []  # in-memory chunk list


def chunk_text(text, chunk_size=500, overlap=100):
    """
    Split text into overlapping chunks for better retrieval.
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def build_index_from_text(document_text):
    """
    Build FAISS index for a given document's text.
    """
    global stored_chunks
    chunks = chunk_text(document_text)
    stored_chunks = chunks

    embeddings = embedder.encode(chunks)
    index.add(np.array(embeddings, dtype=np.float32))
    return len(chunks)


def retrieve_relevant_chunks(query, top_k=3):
    """
    Retrieve top-k relevant text chunks for a query.
    """
    query_vec = embedder.encode([query])
    D, I = index.search(np.array(query_vec, dtype=np.float32), top_k)
    results = [stored_chunks[i] for i in I[0]]
    return results
