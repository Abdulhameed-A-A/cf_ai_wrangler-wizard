# Wrangler Wizard

Wrangler Wizard is a Next.js 16 App Router project that turns a plain-English Cloudflare project description into:

- a copy-ready `wrangler.jsonc` file
- the terminal commands needed to create the required resources

## Features

- Dark, developer-focused UI built with Tailwind CSS v4
- Cloudflare Workers AI-backed generation route at `/api/generate`
- Fallback config generation when AI credentials are missing or parsing fails
- Copy buttons for config and commands
- Download button for `wrangler.jsonc`
- Responsive layout for mobile and desktop

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Zod

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## AI Configuration

The `/api/generate` route uses Cloudflare Workers AI when the following environment variables are available:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

If those values are missing, the app generates a local fallback configuration so the UI still works during development.

## Validation Rules

- Prompts must be at least 10 characters long.
- Prompts can be up to 2,000 characters.
- The API returns structured JSON and falls back to a safe default if the model output cannot be parsed.

## Deployment Notes

This project is ready for Cloudflare Pages deployment with the Next.js App Router. Set the environment variables above in your Pages project before enabling live AI generation.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
