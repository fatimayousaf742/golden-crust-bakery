"""
Golden Crust RAG Chatbot - HTTP API Server
==========================================
Run 'python api_server.py' to serve the chatbot to the website frontend.

The frontend (src/components/Chatbot) calls:
  POST http://localhost:8000/api/chat   body: {"message": "..."} -> {"response": "..."}
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chatbot import GoldenCrustChatbot

HOST = "0.0.0.0"
PORT = int(os.environ.get("CHATBOT_PORT", "8000"))

ALLOWED_ORIGIN = "http://localhost:5173"


class ChatHandler(BaseHTTPRequestHandler):
    server_version = "GoldenCrustChatbot/1.0"

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/health":
            self._send_json(200, {"status": "ok"})
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/api/chat":
            self._send_json(404, {"error": "Not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw.decode("utf-8"))
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        message = (data.get("message") or "").strip()
        if not message:
            self._send_json(400, {"error": "'message' is required"})
            return

        try:
            response = self.server.bot.answer(message)
            self._send_json(200, {"response": response})
        except Exception as e:
            self._send_json(500, {"error": str(e)})

    def log_message(self, fmt, *args):
        sys.stdout.write("[chatbot] %s\n" % (fmt % args))


def main():
    try:
        print("Loading Golden Crust chatbot (this may take a moment)...")
        bot = GoldenCrustChatbot()
    except ValueError as e:
        print(f"\nError: {e}")
        print("\nTo fix this, edit the file rag_chatbot/.env and replace:")
        print("  GROQ_API_KEY=gsk_your_api_key_here")
        print("with your actual Groq API key from https://console.groq.com")
        sys.exit(1)

    server = ThreadingHTTPServer((HOST, PORT), ChatHandler)
    server.bot = bot

    print(f"\nChatbot API running at http://localhost:{PORT}")
    print(f"  POST http://localhost:{PORT}/api/chat  (used by the React frontend)")
    print("  Press Ctrl+C to stop.\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down chatbot API...")
        server.server_close()


if __name__ == "__main__":
    main()
