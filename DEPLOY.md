Vercel deployment (recommended)
------------------------------

Quick steps to deploy this Next.js app to Vercel and keep it running without your machine:

1. Sign in to Vercel and import this GitHub repository.
2. Set environment variables in Vercel Project Settings:
   - `OPENAI_API_KEY` = your OpenAI API key (or leave blank to use local Ollama)
   - `OPENAI_MODEL` = optional (e.g. `gpt-4o-mini`)
   - `NEXTAUTH_SECRET` = random secret
   - If you prefer Ollama (not recommended for remote runs), set `USE_OLLAMA=1` and `OLLAMA_URL` to a reachable URL.
3. Deploy — Vercel will build and serve the app automatically on push.

Notes:
- This repo includes a small `apps/frontend/data/rag_docs.json` with sample documents. Serverless functions on Vercel cannot persist local files at runtime, so for production you should move RAG storage to a managed DB (Supabase/Postgres + pgvector, Pinecone, or similar) if you need dynamic ingestion.
- For reliable, always-on LLM access, using OpenAI is simplest (paid API). Ollama requires you to run a server/VM that Vercel can reach.

If you want, I can:
- Prepare a `vercel.json` and minimal CI notes and push them, or
- Create a `Dockerfile` + `docker-compose.yml` for VPS deployment (if you prefer your own server), or
- Help provision Supabase/Postgres and migrate RAG to pgvector.
