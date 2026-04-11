"use client";

import { useEffect, useMemo, useState } from "react";
import { FileJson2, ListChecks, TerminalSquare, TriangleAlert } from "lucide-react";
import { InputSection } from "@/components/InputSection";
import { OutputPanel } from "@/components/OutputPanel";
import { buildFallbackGeneration, generationResponseSchema } from "@/lib/wrangler";

const PLACEHOLDERS = [
  "I want a Worker that writes to a D1 database and stores uploads in R2.",
  "I need a Next.js app on Pages with KV caching and a Worker API.",
  "Build me a Worker that uses Workers AI and needs nodejs_compat.",
];

const EXAMPLE_PROMPTS = [
  "I need a Worker with a D1 database for structured data.",
  "I want image uploads stored in R2 and served by a Worker.",
  "Build a Cloudflare Worker with KV caching and nodejs_compat.",
];

const EMPTY_OUTPUT = "Generate a project description to see the resulting configuration here.";

type GenerationState = {
  config: string;
  commands: string[];
  guidance: string[];
};

function joinCommands(commands: string[]) {
  return commands.join("\n");
}

function joinGuidance(guidance: string[]) {
  return guidance.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function downloadJsonc(content: string) {
  const blob = new Blob([content], { type: "application/jsonc;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "wrangler.jsonc";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [result, setResult] = useState<GenerationState | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % PLACEHOLDERS.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const placeholder = PLACEHOLDERS[placeholderIndex];
  const isTooShort = prompt.trim().length < 10;
  const characterCount = prompt.length;

  const configText = result?.config ?? "";
  const commandText = useMemo(() => joinCommands(result?.commands ?? []), [result]);
  const guidanceText = useMemo(() => joinGuidance(result?.guidance ?? []), [result]);

  async function handleGenerate() {
    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 10) {
      setError("Please add a little more detail before generating.");
      setWarning(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      const payload = (await response.json()) as
        | { success: true; data: GenerationState; warning?: string }
        | { success: false; error: string };

      if (!response.ok || !payload.success) {
        throw new Error("error" in payload ? payload.error : "Something went wrong.");
      }

      const parsed = generationResponseSchema.safeParse(payload.data);

      if (!parsed.success) {
        throw new Error("Could not validate the generated configuration.");
      }

      setResult(parsed.data);
      setWarning(payload.warning ?? null);
    } catch (requestError) {
      const fallback = buildFallbackGeneration(trimmedPrompt);
      setResult(fallback);
      setWarning(
        requestError instanceof Error && requestError.message
          ? requestError.message
          : "AI service temporarily unavailable. Please try again in a few moments."
      );
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-8 md:py-12">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-90">
        <div className="absolute left-1/2 top-0 h-72 w-2xl -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-orange-300/90">
          Interactive Wrangler Wizard
        </p>
        <p className="max-w-2xl text-base leading-7 text-neutral-400 md:text-lg">
          Describe your Cloudflare project in plain English and get a wrangler.jsonc file plus the
          exact terminal commands to create the needed resources.
        </p>
      </div>

      <div className="grid gap-4">
        <InputSection
          prompt={prompt}
          placeholder={placeholder}
          isLoading={isLoading}
          isTooShort={isTooShort}
          characterCount={characterCount}
          errorMessage={error}
          examples={EXAMPLE_PROMPTS}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
        />

        {warning ? (
          <div className="inline-flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{warning}</span>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <OutputPanel
            title="wrangler.jsonc"
            badge={<FileJson2 className="h-4 w-4 text-orange-300" />}
            content={configText}
            emptyState={EMPTY_OUTPUT}
            copyLabel="Copy configuration to clipboard"
            onDownload={configText ? () => downloadJsonc(configText) : undefined}
            downloadLabel="Download .jsonc"
          />

          <OutputPanel
            title="Terminal Commands"
            badge={<TerminalSquare className="h-4 w-4 text-orange-300" />}
            content={commandText}
            emptyState={EMPTY_OUTPUT}
            copyLabel="Copy commands to clipboard"
          />
        </div>

        <OutputPanel
          title="What To Change + Steps"
          badge={<ListChecks className="h-4 w-4 text-orange-300" />}
          content={guidanceText}
          emptyState="Generate a prompt to see exactly what to edit and what to run next."
          copyLabel="Copy guidance steps"
        />
      </div>
    </main>
  );
}