import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { CopyButton } from "./CopyButton";

type OutputPanelProps = {
  title: string;
  badge: ReactNode;
  content: string;
  emptyState: string;
  copyLabel: string;
  onDownload?: () => void;
  downloadLabel?: string;
};

export function OutputPanel({
  title,
  badge,
  content,
  emptyState,
  copyLabel,
  onDownload,
  downloadLabel = "Download",
}: OutputPanelProps) {
  const hasContent = content.trim().length > 0;

  return (
    <section className="rounded-3xl border border-neutral-800 bg-[color:var(--panel-bg)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-lg font-semibold text-neutral-100">
            {badge}
            {title}
          </p>
          <p className="text-sm text-neutral-400">Copy-ready output for your project.</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton label={copyLabel} value={content} />
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              disabled={!hasContent}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 transition-colors hover:border-neutral-500 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{downloadLabel}</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--code-border)] bg-[color:var(--code-bg)] p-4 shadow-inner shadow-black/20">
        <pre className="code-font max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-neutral-100">
          <code>{hasContent ? content : emptyState}</code>
        </pre>
      </div>
    </section>
  );
}