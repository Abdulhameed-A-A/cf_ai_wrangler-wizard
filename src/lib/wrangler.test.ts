import { describe, it, expect } from "vitest";
import { inferRequirements, buildFallbackGeneration, normalizeGenerationData } from "./wrangler";

describe("wrangler wizard tests", () => {
  it("infers requirements from prompt", () => {
    const req = inferRequirements("I want a Vue nextjs worker with D1 and AI.");
    expect(req.includeNode).toBe(true);
    expect(req.includeD1).toBe(true);
    expect(req.includeR2).toBe(false);
    expect(req.includeAi).toBe(true);
    expect(req.framework).toBe("Next.js");
  });

  it("buildFallbackGeneration creates fallback commands", () => {
    const result = buildFallbackGeneration("Hello worker d1 kv");
    expect(result.commands).toContain("npm create cloudflare@latest hello-worker-d1-kv");
    expect(result.guidance.length).toBeGreaterThan(0);
  });

  it("normalizes data correctly", () => {
    const raw = {
      config: { "kv_namespaces": [{ "id": "1234" }] },
      commands: ["wrangler generate my-worker", "wrangler publish"]
    };
    const result = normalizeGenerationData(raw, "with KV");
    expect(result.commands).toContain("npm create cloudflare@latest");
    expect(result.commands).toContain("npx wrangler deploy");
  });
});
