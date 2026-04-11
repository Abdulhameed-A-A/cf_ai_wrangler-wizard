# Project Specification: Interactive Wrangler Wizard

## 1. Project Overview

**Goal**  
Build an AI‑powered web tool that converts plain‑English descriptions of a Cloudflare project into a valid `wrangler.jsonc` configuration file and the corresponding terminal commands (using `wrangler` CLI). The tool is deployed on Cloudflare Pages and uses Cloudflare Workers AI for the natural language → configuration generation.

**Primary User**  
A developer (beginner to intermediate) who wants to start a new Cloudflare project (Workers, Pages, D1, R2, etc.) but finds manual `wrangler.jsonc` configuration error‑prone or intimidating.

**Success Metric**  
A user can type a sentence like *“I need a Worker that writes to a D1 database and also uses R2 for image storage”* and receive a copy‑paste ready `wrangler.jsonc` file plus the exact CLI commands to create the D1 database and R2 bucket.

---

## 2. Technology Stack

| Category         | Technology                                      | Version / Notes                                                                 |
|------------------|------------------------------------------------|---------------------------------------------------------------------------------|
| Framework        | Next.js                                        | 16 (App Router)                                                                |
| Language         | TypeScript                                     | latest                                                                         |
| Styling          | Tailwind CSS                                   | v4                                                                             |
| React            | React                                          | latest (19.x)                                                                  |
| AI Inference     | Cloudflare Workers AI                          | Use `@cloudflare/ai` package + `@cloudflare/workers-types`                     |
| Deployment       | Cloudflare Pages                               | Connected to GitHub repo                                                       |
| Runtime / APIs   | Cloudflare Pages Functions (Edge)              | For calling Workers AI (avoids CORS & API key exposure)                        |
| Config format    | `wrangler.jsonc` (JSON with comments)          | Target format for generated output                                             |
| HTTP client      | native `fetch` (Edge compatible)               | –                                                                              |
| State management | React `useState`, `useReducer` (no extra libs) | –                                                                              |
| Validation       | Zod (optional, recommended)                    | Validate AI output before showing to user                                      |

> **Note:** No external database is required for MVP. All state lives in the browser. However, you may add Cloudflare D1 later for saving popular templates.

---

## 3. Core Functionalities (MVP)

### 3.1 User Input
- A **large textarea** where the user describes their Cloudflare project in natural language.
- Example placeholder: *“I want a Next.js app on Pages that uses a D1 database and a R2 bucket for file uploads.”*
- A **“Generate” button** to trigger AI processing.

### 3.2 AI Processing
- Send the user’s description to Cloudflare Workers AI (model: `@cf/meta/llama-3.2-3b-instruct` or `@cf/meta/llama-3.1-8b-instruct`).
- Use a **structured prompt** that forces the AI to output **two things**:
  1. A valid `wrangler.jsonc` configuration object (as a JSON string with comments allowed).
  2. A list of terminal commands (as an array of strings).
- The prompt must instruct the AI to:
  - Only use valid Cloudflare bindings (`d1_databases`, `r2_buckets`, `kv_namespaces`, `ai`, `browser`).
  - Include `compatibility_flags = ["nodejs_compat"]` if any Node.js API is implied.
  - Not hallucinate bindings that don’t exist.
- If the AI output is malformed or incomplete, the system should **fall back** to a default config + a friendly error message suggesting rephrasing.

### 3.3 Output Display
- **Two tabs or side‑by‑side panels**:
  - **Config File** – shows `wrangler.jsonc` syntax‑highlighted (monospace, line numbers optional).
  - **Terminal Commands** – shows commands as code block (e.g., `npx wrangler d1 create my-database`).
- **Copy buttons** next to each panel that copy the respective content to clipboard.
- **Download button** to save the `wrangler.jsonc` file locally.

### 3.4 Error Handling
- If the AI request fails (network, quota, model error), display a clear message: *“AI service temporarily unavailable. Please try again in a few moments.”*
- If the AI returns invalid JSON, show a fallback message: *“Could not parse AI response. Try rephrasing your request.”*

### 3.5 Loading States
- While generating: disable the “Generate” button, show a spinner, and display “Thinking…” text.

---

## 4. Step‑by‑Step Milestones

Use these milestones to track progress. Each milestone should be fully functional and tested before moving to the next.

### Milestone 0: Project Bootstrap (Day 1)
- [ ] Create new Next.js 16 project with TypeScript + Tailwind v4.
- [ ] Configure `next.config.ts` to output static + edge compatible (if needed).
- [ ] Set up Cloudflare Pages integration (push to GitHub, connect to Pages).
- [ ] Verify a simple “Hello World” deploys to `*.pages.dev`.

### Milestone 1: Static UI (Day 2–3)
- [ ] Build the main page layout:
  - Header with title and description.
  - Central textarea (width: 100%, height: 150px).
  - “Generate” button (primary colour, large).
  - Two output panels (config + commands) initially empty.
- [ ] Use Tailwind v4 (no custom CSS file except maybe a base layer).
- [ ] Add responsive behaviour (stack panels on mobile, side‑by‑side on desktop).

### Milestone 2: Cloudflare Workers AI Integration (Day 4–6)
- [ ] Create a Cloudflare Workers AI account and get API key (store as Pages secret).
- [ ] Build a Pages Function `/api/generate` that:
  - Accepts POST with `{ prompt: string }`.
  - Calls Workers AI using the `@cloudflare/ai` SDK (or fetch directly).
  - Returns JSON: `{ config: string, commands: string[] }`.
- [ ] From the Next.js frontend, call `/api/generate` when “Generate” is clicked.
- [ ] Display the raw AI response (temporarily) to verify the prompt works.

### Milestone 3: Prompt Engineering & Output Parsing (Day 7–9)
- [ ] Write a system prompt that forces a **structured output** (e.g., JSON object with `configFileContent` and `commands` fields).
- [ ] Implement a **response validator** using Zod to ensure the AI returned the expected shape.
- [ ] If validation fails, display fallback UI and optionally log the raw response for debugging.
- [ ] Hardcode a few test prompts to confirm the AI generates valid `wrangler.jsonc` (e.g., “only a Worker with no bindings”, “Worker + D1”, “Worker + R2 + D1”).

### Milestone 4: Copy & Download Features (Day 10)
- [ ] Add “Copy config” button → copies `wrangler.jsonc` content to clipboard.
- [ ] Add “Copy commands” button → copies all commands (joined by newline).
- [ ] Add “Download .jsonc” button → triggers a file download.
- [ ] Show a temporary “Copied!” tooltip/notification.

### Milestone 5: Polish & Error Handling (Day 11–12)
- [ ] Implement graceful error handling for network failures and rate limits.
- [ ] Add client‑side loading state with disabled button.
- [ ] Improve accessibility: ARIA labels, keyboard navigation.
- [ ] Write a `README.md` explaining the project, how to run locally, and how to deploy.

### Milestone 6: Final Deployment & Testing (Day 13–14)
- [ ] Deploy to Cloudflare Pages (production branch).
- [ ] Test on real devices (mobile, desktop, different browsers).
- [ ] Optimize Tailwind bundle (ensure no unused CSS in production).
- [ ] Add a simple analytics event (optional, e.g., Cloudflare Web Analytics).

---

## 5. Detailed Functional Requirements

### 5.1 Input Field Behaviour
- **Minimum length**: 10 characters (show a warning if too short).
- **Maximum length**: 2000 characters (enforced by backend to avoid abuse).
- **Placeholder text** cycles through examples every 10 seconds (optional nice‑to‑have).

### 5.2 AI Prompt Template (Must be used in `/api/generate`)
You are an expert Cloudflare developer. Convert the user's request into two things:
1. A valid `wrangler.jsonc` configuration file content (as a single string).
2. A list of terminal commands to create the required resources (e.g., `npx wrangler d1 create <name>`).

Rules:
- The config must be valid JSON with comments (`.jsonc`).
- Include `name = "my-worker"` (use a sensible default).
- Include `compatibility_date = "2025-03-01"`.
- If D1 is needed, add a `d1_databases` binding.
- If R2 is needed, add an `r2_buckets` binding.
- If Workers AI is needed, add `ai = { binding = "AI" }`.
- Commands should be ready to copy-paste into terminal (with `npx wrangler` prefix).

User request: """{{userPrompt}}"""

Respond **only** with a JSON object:
{
  "config": "string (the entire wrangler.jsonc content)",
  "commands": ["string", "string", ...]
}

### 5.3 Backend API Specification (`/api/generate`)
- **Method**: POST
- **Request body**: `{ prompt: string }`
- **Response** (success, 200):  
  `{ success: true, data: { config: string, commands: string[] } }`
- **Response** (error, 4xx/5xx):  
  `{ success: false, error: string }`
- **Timeout**: 30 seconds (Workers AI may take ~10s).
- **Rate limiting**: Not required for MVP but good to note.

### 5.4 Frontend State Machine
- `idle` → user types, button enabled.
- `loading` → button disabled, show spinner, AI request in flight.
- `success` → output panels populated, copy/download enabled.
- `error` → show error message, button re‑enabled.

---

## 6. Future Enhancements (Post‑MVP, for internship “wow” factor)
- **Template saving**: Use Cloudflare D1 to store popular generated configs (anonymously).
- **Live validation**: Syntax‑highlight the config and highlight potential errors.
- **Custom naming**: Let users override the default `name = "my-worker"`.
- **Shareable URL**: Encode the prompt and generated output in URL hash for sharing.
- **Dark mode** (though Tailwind v4 can easily support it).

---

## 7. Environment Variables (Cloudflare Pages Secrets)

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID       |
| `CLOUDFLARE_API_TOKEN`   | API token with Workers AI access |

These are accessed inside the Pages Function via `env` object.

---

## 8. File Structure (Next.js 16 App Router)





project-root/
├── app/
│ ├── layout.tsx
│ ├── page.tsx # Main wizard UI
│ ├── globals.css # Tailwind imports
│ └── api/
│ └── generate/
│ └── route.ts # Pages Function for AI
├── components/
│ ├── InputSection.tsx
│ ├── OutputPanel.tsx
│ ├── CopyButton.tsx
│ └── LoadingSpinner.tsx
├── lib/
│ ├── ai-client.ts # Workers AI wrapper
│ ├── prompt-builder.ts # Build the system+user prompt
│ └── validators.ts # Zod schema for AI response
├── public/ # static assets
├── tailwind.config.ts # Tailwind v4 config
├── tsconfig.json
└── README.md

text

---

## 9. Testing Checklist (Before Submitting Internship Application)

- [ ] User type s “I need a Worker with a D1 database” → config contains `d1_databases` binding and a command `npx wrangler d1 create ...`.
- [ ] User types “I want an R2 bucket for images” → config contains `r2_buckets` binding.
- [ ] User types an empty string → button disabled or shows error.
- [ ] Network offline → error message appears.
- [ ] Copy buttons work on all modern browsers (Chrome, Firefox, Safari).
- [ ] Download button saves a `.jsonc` file with correct MIME type.
- [ ] Mobile layout: panels stack, textarea full width, buttons tappable.
- [ ] Lighthouse performance > 90 (due to minimal client JS and edge API).