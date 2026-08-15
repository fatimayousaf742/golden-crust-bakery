"""
Golden Crust RAG Chatbot
=======================
Step 1: Run 'python ingest.py' to scrape, chunk, embed, and store all website data.
Step 2: Run 'python main.py' to start chatting with the bakery assistant.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from chatbot import GoldenCrustChatbot

def main():
    try:
        bot = GoldenCrustChatbot()
    except ValueError as e:
        print(f"\nError: {e}")
        print("\nTo fix this, edit the file rag_chatbot/.env and replace:")
        print("  GROQ_API_KEY=gsk_your_api_key_here")
        print("with your actual Groq API key from https://console.groq.com")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("  Golden Crust Bakery Assistant")
    print("  Ask me anything about our bakery, menu, or services!")
    print("  Type 'quit' or 'exit' to stop.")
    print("=" * 60)

    while True:
        try:
            query = input("\nYou: ").strip()
            if query.lower() in ("quit", "exit", "q"):
                print("Bot: Thank you for visiting Golden Crust! Have a wonderful day!")
                break
            if not query:
                continue

            print("Bot: ", end="", flush=True)
            response = bot.answer(query)
            print(response)

        except KeyboardInterrupt:
            print("\nBot: Goodbye! Come back soon!")
            break
        except Exception as e:
            print(f"\nError: {e}")

if __name__ == "__main__":
    main()
