# 🧙‍♂️ Wrangler Wizard

**Wrangler Wizard** is an intelligent, developer-focused workspace bootstrapping tool that dramatically accelerates starting new Cloudflare projects. By leveraging Cloudflare's powerful Workers AI, Wrangler Wizard translates plain-English project descriptions into production-ready Cloudflare configurations (`wrangler.jsonc`) and deterministic generation commands, eliminating the boilerplate associated with setting up complex bindings and services.

This project was built to demonstrate an intuitive, robust developer experience—one that bridges the gap between intention and execution within the Cloudflare ecosystem.

## 🚀 Key Features

- **AI-Driven Bootstrapping**: Uses Cloudflare Workers AI (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) securely via an edge-optimized `/api/generate` route.
- **Deterministic & Safe Generation**: The AI output passes through a strict extraction and validation pipeline. It intelligently replaces hallucinations and deprecated commands (e.g., legacy `wrangler generate`) with standard `npm create cloudflare@latest` implementations.
- **Framework-Aware Guidance**: The Wizard detects the intended framework (Next.js, Vue, Nuxt, Remix, Hono, etc.) from the prompt and generates step-by-step, framework-specific instructions.
- **Flawless Developer UX**: 
  - Sleek, dark-themed UI built using Tailwind CSS v4.
  - Interactive placeholder highlighting, directing users exactly where to inject their UUIDs/resource IDs.
  - Instant copy and `.jsonc` download functionality.
  - Fault-tolerant design with sileGemini 3.1 Pro (Preview) • 1xnt local fallbacks during rate limits or missing credentials.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 App Router (running on the Edge Runtime).
- **UI/Styling**: React 19, Tailwind CSS v4, Lucide Icons.
- **Validation**: Zod (for strict JSON mode parsing and schema coercion).
- **Testing**: Vitest for unit-testing the AI fallback generation logic and command guardrails.
- **AI Backend**: Cloudflare Workers AI via REST.

## 🏁 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run tests to verify the project is functioning correctly:

```bash
npm test
```

3. Run the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## AI Configuration

The `/api/generate` route uses Cloudflare Workers AI when the following environment variables are available:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

If those values are missing, the app generates a local fallback configuration so the UI still works during development.

## Validation Rules

- Prompts must be at least 10 characters long.
- Prompts can be up to 2,000 characters.
- The API returns structured JSON and falls back to a safe default if the model output cannot be parsed.

## 💡 Why This Project?

Wrangler Wizard demonstrates exactly what modern development should feel like: fast, reliable, and invisible edge abstractions. I built this to emphasize my understanding of Cloudflare’s ecosystem—from its AI orchestration and CLI ecosystem (`C3`) to D1 and KV routing.

Deploying to Cloudflare should always be this easy.

## ☁️ Deployment on Cloudflare Pages

This project is optimized and QA-ready for a direct Cloudflare Pages deployment with the Next.js App Router configured to run entirely via the Edge Runtime.

### Important Build Settings 
When deploying on the Cloudflare Dashboard, use these exact settings:
- **Framework Preset**: `Next.js`
- **Build command**: `npx @cloudflare/next-on-pages@1`
- **Build output directory**: `.vercel/output/static`

*Note: Without these settings, Cloudflare will attempt to upload raw `.next/cache` pack files as standard assets, which causes the `25 MiB` asset size limit failure.*

Ensure you set all required environment variables (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`) within your Cloudflare Pages dashboard before bringing the AI integrations live.
