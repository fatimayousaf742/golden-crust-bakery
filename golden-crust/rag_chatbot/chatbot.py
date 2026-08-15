import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from groq import Groq

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "golden_crust_knowledge"
TOP_K = 3

CHAIN_OF_THOUGHT_PROMPT = """You are a friendly, knowledgeable customer service representative for Golden Crust Artisan Bakery. Your responses must feel warm, human, and natural — like talking to a real person at a beloved local bakery.

# Chain of Thought Process
1. UNDERSTAND: First, identify what the customer is asking about.
2. SEARCH: Look through the provided context for relevant information.
3. REASON: Think step-by-step about what the customer needs to know.
4. RESPOND: Craft a warm, well-structured answer that feels personal and human.

# Guidelines
- Be conversational and warm, not robotic or overly formal
- Structure your response with clear sections (use short paragraphs, not bullet points in a rigid way)
- If the context doesn't have enough information, let the customer know honestly and offer to help further
- Keep responses concise but complete — 3-5 short paragraphs max
- Use natural transitions and a friendly tone
- Never say "according to the context" or "based on the provided information" — just answer naturally
- If mentioning prices, be clear about them
- End with a warm closing that invites follow-up questions

Context from our bakery:
{context}

Customer Question: {query}

Response:"""

class GoldenCrustChatbot:
    def __init__(self):
        print("Loading embedding model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        print("Connecting to ChromaDB...")
        self.client = chromadb.PersistentClient(
            path=CHROMA_DIR,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_collection(COLLECTION_NAME)

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key or api_key == "gsk_your_api_key_here":
            raise ValueError(
                "Please set your GROQ_API_KEY in rag_chatbot/.env file.\n"
                "Get your API key from https://console.groq.com"
            )
        self.llm = Groq(api_key=api_key)
        # Current stable models as of July 2026
        self.models = [
            "llama-3.3-70b-versatile",    # Production, direct replacement (until Aug 16, 2026)
            "openai/gpt-oss-120b",         # Production, future-proof
            "llama-3.1-8b-instant",        # Production fallback (smaller but always available)
        ]
        self.model_index = 0

    def retrieve(self, query):
        query_emb = self.model.encode(query, normalize_embeddings=True)
        results = self.collection.query(
            query_embeddings=[query_emb.tolist()],
            n_results=TOP_K
        )
        documents = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []
        return documents, metadatas

    def answer(self, query):
        documents, metadatas = self.retrieve(query)

        if not documents:
            return (
                "I'm sorry, I don't have enough information about that yet. "
                "Could you ask me something else about our bakery, menu, or services? "
                "I'd be happy to help!"
            )

        context_parts = []
        for i, (doc, meta) in enumerate(zip(documents, metadatas)):
            source = meta.get("source", "general")
            context_parts.append(f"[Source: {source}]\n{doc}")

        context_text = "\n\n".join(context_parts)

        prompt = CHAIN_OF_THOUGHT_PROMPT.format(
            context=context_text,
            query=query
        )

        while self.model_index < len(self.models):
            try:
                response = self.llm.chat.completions.create(
                    model=self.models[self.model_index],
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a warm, knowledgeable customer service representative for Golden Crust Artisan Bakery. Answer naturally and conversationally."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                if hasattr(e, 'status_code') and e.status_code == 400:
                    print(f"  Model '{self.models[self.model_index]}' failed, trying next...")
                    self.model_index += 1
                else:
                    raise

        return "I'm sorry, I'm having trouble connecting right now. Please try again later."
