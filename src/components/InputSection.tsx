"use client";

import { Sparkles } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

type InputSectionProps = {
  prompt: string;
  placeholder: string;
  isLoading: boolean;
  isTooShort: boolean;
  characterCount: number;
  errorMessage: string | null;
  examples: string[];
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
};

export function InputSection({
  prompt,
  placeholder,
  isLoading,
  isTooShort,
  characterCount,
  errorMessage,
  examples,
  onPromptChange,
  onGenerate,
}: InputSectionProps) {
  return (
    <section className="rounded-3xl border border-neutral-800 bg-[color:var(--panel-bg)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            Wrangler Wizard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-50 md:text-4xl">
            Describe the Cloudflare project you want to build.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-400">
            Turn plain English into a wrangler.jsonc file and the terminal commands needed to
            create its resources.
          </p>
        </div>
      </div>

      <label className="mb-3 block text-sm font-medium text-neutral-200" htmlFor="project-prompt">
        Project description
      </label>
      <textarea
        id="project-prompt"
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        className="min-h-40 w-full rounded-2xl border border-neutral-800 bg-[color:var(--panel-soft)] p-4 text-base leading-7 text-neutral-100 outline-none transition focus:border-transparent focus:ring-2 focus:ring-orange-500/60"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-400">
        <p>
          Minimum 10 characters. Maximum 2,000 characters. {characterCount}/2000
        </p>
      </div>

      {errorMessage ? <p className="mt-3 text-sm text-red-300">{errorMessage}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPromptChange(example)}
            className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-100"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || isTooShort}
          className="inline-flex min-w-44 items-center justify-center gap-3 rounded-full bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_28px_rgba(249,115,22,0.32)] transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Generate wrangler configuration"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Thinking...
            </>
          ) : (
            "Generate"
          )}
        </button>

        <p className="text-sm text-neutral-400">
          {isTooShort ? "Add a little more detail to enable generation." : "Ready when you are."}
        </p>
      </div>
    </section>
  );
}