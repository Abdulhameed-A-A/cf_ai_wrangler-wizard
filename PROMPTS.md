# Prompts Used to Build Wrangler Wizard

Below is a log of the key prompts I used while building this project with AI assistance. They reflect my actual development workflow from debugging tricky parsing issues to polishing the final product for submission.

## Core Development Prompts

1. **"I keep running into a parsing error on the AI response. Can you walk through the parsing logic with me, make the fallback more resilient, and add some tests so we catch this earlier?"**

2. **"Some of the suggested commands in the output are outdated, things like `wrangler generate` which is deprecated. Let's update the normalizer so it always recommends `npm create cloudflare@latest` instead."**

3. **"Now that we're working with real API payloads, the extraction logic needs to be tighter. Even if the AI returns slightly malformed JSON, the final output should still be valid and usable."**

4. **"Can we add a 'Guidance' section to the UI? After generating a config, the tool should walk the user through exactly what to tweak and which commands to run next."**

5. **"I'm getting a 'Could not parse AI response' error on more complex promptslooks like schema mismatches. Let's loosen up the Zod validation so it's more forgiving when the AI returns slightly different object shapes."**

6. **"Let's knock out the remaining production readiness items in order: tighten up the command guardrails, make the guidance aware of which framework is being used, add success toasts and proper loading states, write unit tests for the normalizers, and update the README for deployment."**

7. **"We still have a few items left on the to do list let's keep the momentum going and finish them out."**

8. **"Add the spec and design files to `.gitignore` so they don't end up in the repo. Then create a `PROMPTS.md` to document how this was built, and clean up the `README.md` so the whole project looks polished and ready for the Cloudflare submission."**

## Example Testing Prompts

These are some of the prompts I used to test the tool during development, ranging from simple single service setups to complex multi resource architectures:

- "Build a Cloudflare Worker with KV caching and nodejs_compat."
- "I need a Worker with a D1 database for structured data."
- "I want a Worker that writes to a D1 database and stores uploads in R2."
- "I need a Next.js app on Pages with KV caching and a Worker API."
- "Build me a Worker that uses Workers AI and needs nodejs_compat."
- "I need a Vue app with a D1 database."
- "I need a Cloudflare Worker with a D1 database for storing user profiles, an R2 bucket for profile pictures, and Workers AI for moderating image content. Use the nodejs_compat compatibility flag."
