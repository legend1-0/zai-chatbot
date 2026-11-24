# z.ai Chatbot

Minimal Next.js chatbot for trying out the [z.ai](https://z.ai) (GLM) API before a hackathon. The frontend is a single chat page; the API key never reaches the browser — it's used server-side in `app/api/chat/route.ts`.

## Run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and set ZAI_API_KEY to your real key
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable       | Required | Default                          | Notes                                   |
|----------------|----------|-----------------------------------|------------------------------------------|
| `ZAI_API_KEY`  | yes      | —                                 | Your z.ai API key                        |
| `ZAI_BASE_URL` | no       | `https://api.z.ai/api/paas/v4`    | OpenAI-compatible base URL               |
| `ZAI_MODEL`    | no       | `glm-4.6`                         | Any z.ai chat model, e.g. `glm-4.5-air`  |

## Deploy to Vercel

1. Push this repo to GitHub (already done if you got this from the repo).
2. Go to https://vercel.com/new and import the repo.
3. In the Vercel project settings → Environment Variables, add:
   - `ZAI_API_KEY` = your z.ai key
   - (optional) `ZAI_BASE_URL`, `ZAI_MODEL`
4. Deploy. The `/api/chat` route runs server-side, so the key stays private.

## How it works

- `app/page.tsx` — chat UI (client component), keeps message history in state.
- `app/api/chat/route.ts` — server route that forwards the conversation to z.ai's OpenAI-compatible `chat/completions` endpoint and returns the reply.
- No database, no auth — just enough to confirm your z.ai key and model work before hackathon day.
