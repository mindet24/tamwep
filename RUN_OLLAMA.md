How to run Ollama for this project
=================================

Two common options:

1) Run Ollama on your local machine (for development)

- Install Ollama following official instructions: https://ollama.com/docs
- Pull a model you want to use, e.g.:

```
ollama pull llama2
```

- Start the Ollama server:

```
ollama serve
```

By default the API listens on `http://localhost:11434`. Set `OLLAMA_URL` to that value in your environment.

2) Run Ollama on a VM/VPS (recommended for production)

- Provision a small VM (DigitalOcean, Linode, AWS). Install Ollama there.
- Pull required models and run `ollama serve` (consider running under systemd or inside a container to keep it running).
- Optionally front with a reverse proxy (nginx) and secure with TLS + token-based auth.

Security note: Do NOT expose Ollama to the public internet without authentication and TLS. Use a reverse proxy and firewall rules.

After Ollama is running and reachable, set in your production env (Vercel/compose):

```
USE_OLLAMA=1
OLLAMA_URL=https://ollama.yourdomain.example
OLLAMA_MODEL=llama2
```

Then restart your app. The `POST /api/llm/recommend` endpoint will call the Ollama server.
