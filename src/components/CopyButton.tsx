"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

type CopyButtonProps = {
  label: string;
  value: string;
  onCopied?: () => void;
  className?: string;
};

export function CopyButton({ label, value, onCopied, className = "" }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isCopied]);

  async function handleCopy() {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    setIsCopied(true);
    onCopied?.();
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
    </button>
  );
}