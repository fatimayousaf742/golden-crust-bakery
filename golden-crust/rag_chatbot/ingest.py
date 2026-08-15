import os
import re
import tiktoken
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

encoder = tiktoken.get_encoding("cl100k_base")
CHUNK_SIZE = 250
CHUNK_OVERLAP = 40

def chunk_text(text, source_label):
    text = re.sub(r'\s+', ' ', text).strip()
    if not text or len(text) < 10:
        return []
    tokens = encoder.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + CHUNK_SIZE, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_str = encoder.decode(chunk_tokens)
        chunks.append({"text": chunk_str, "source": source_label})
        if end >= len(tokens):
            break
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks

def extract_jsx_text(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    texts = re.findall(r'>([^<]+)<', content)
    clean = " ".join(t.strip() for t in texts if t.strip())
    return re.sub(r'\s+', ' ', clean).strip()

def extract_category_data(content):
    chunks = []

    cat_blocks = re.findall(
        r"\{\s*name:\s*'([^']+)'\s*,\s*emoji:\s*'([^']+)'\s*,\s*description:\s*'([^']+)'",
        content
    )
    for cat_name, cat_emoji, cat_desc in cat_blocks:
        cat_text = f"Category: {cat_name} {cat_emoji}. {cat_desc}"
        chunks.extend(chunk_text(cat_text, f"category:{cat_name}"))

    item_matches = re.findall(
        r"\{\s*name:\s*'([^']+)'\s*,\s*price:\s*'([^']+)'\s*,\s*description:\s*'([^']+)'",
        content
    )
    for item_name, item_price, item_desc in item_matches:
        item_text = f"Product: {item_name}. Price: {item_price}. Description: {item_desc}."
        chunks.extend(chunk_text(item_text, f"item:{item_name}"))

    badge_matches = re.findall(
        r"name:\s*'([^']+)'.*?badge:\s*'([^']+)'",
        content
    )
    return chunks

def main():
    print("Scraping all website data...")
    all_chunks = []

    category_path = os.path.join(BASE_DIR, "src", "data", "categoryData.js")
    with open(category_path, "r", encoding="utf-8") as f:
        content = f.read()
    all_chunks.extend(extract_category_data(content))

    about_clean = extract_jsx_text(os.path.join(BASE_DIR, "src", "components", "About", "About.jsx"))
    if about_clean:
        all_chunks.extend(chunk_text(f"About Golden Crust Bakery: {about_clean}", "about"))

    contact_clean = extract_jsx_text(os.path.join(BASE_DIR, "src", "components", "Contact", "Contact.jsx"))
    if contact_clean:
        all_chunks.extend(chunk_text(f"Contact Information: {contact_clean}", "contact"))

    hero_clean = extract_jsx_text(os.path.join(BASE_DIR, "src", "components", "Hero", "Hero.jsx"))
    if hero_clean:
        all_chunks.extend(chunk_text(f"Hero Section: {hero_clean}", "hero"))

    footer_clean = extract_jsx_text(os.path.join(BASE_DIR, "src", "components", "Footer", "Footer.jsx"))
    if footer_clean:
        all_chunks.extend(chunk_text(f"Footer: {footer_clean}", "footer"))

    order_path = os.path.join(BASE_DIR, "src", "components", "OrderPopup", "OrderPopup.jsx")
    order_clean = extract_jsx_text(order_path)
    if order_clean:
        all_chunks.extend(chunk_text(f"Order Information: {order_clean}", "order"))

    delivery_path = os.path.join(BASE_DIR, "src", "components", "DeliveryPopup", "DeliveryPopup.jsx")
    delivery_clean = extract_jsx_text(delivery_path)
    if delivery_clean:
        all_chunks.extend(chunk_text(f"Delivery Information: {delivery_clean}", "delivery"))

    server_path = os.path.join(BASE_DIR, "backend", "server.js")
    with open(server_path, "r", encoding="utf-8") as f:
        server_text = f.read()
    endpoints = re.findall(r"app\.(get|post)\(['\"](/api/[^'\"]+)['\"]", server_text)
    if endpoints:
        ep_text = "API Endpoints: " + ", ".join([f"{m.upper()} {p}" for m, p in endpoints])
        all_chunks.extend(chunk_text(ep_text, "api_endpoints"))

    sql_path = os.path.join(BASE_DIR, "backend", "setup.sql")
    with open(sql_path, "r", encoding="utf-8") as f:
        sql_text = f.read()
    sql_clean = re.sub(r'--.*', '', sql_text)
    sql_clean = re.sub(r'\s+', ' ', sql_clean).strip()
    if sql_clean:
        all_chunks.extend(chunk_text(f"Database Schema: {sql_clean[:1500]}", "database_schema"))

    all_chunks = [c for c in all_chunks if len(c["text"].strip()) >= 15]

    print(f"Generated {len(all_chunks)} chunks from website data.")

    print("Loading embedding model: all-MiniLM-L6-v2...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("Generating embeddings for all chunks...")
    texts = [c["text"] for c in all_chunks]
    embeddings = model.encode(texts, show_progress_bar=True, normalize_embeddings=True)

    print("Initializing ChromaDB...")
    os.makedirs(CHROMA_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(anonymized_telemetry=False))

    collection_name = "golden_crust_knowledge"
    try:
        client.delete_collection(collection_name)
    except:
        pass
    collection = client.create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )

    ids = [f"chunk_{i}" for i in range(len(all_chunks))]
    metadatas = [{"source": c["source"]} for c in all_chunks]

    batch_size = 100
    for i in range(0, len(all_chunks), batch_size):
        end = min(i + batch_size, len(all_chunks))
        collection.add(
            ids=ids[i:end],
            embeddings=embeddings[i:end].tolist(),
            documents=texts[i:end],
            metadatas=metadatas[i:end]
        )
        print(f"  Inserted chunks {i} to {end}...")

    print(f"\nDone! Stored {len(all_chunks)} chunks in ChromaDB collection '{collection_name}'.")
    print(f"ChromaDB path: {CHROMA_DIR}")

if __name__ == "__main__":
    main()
