import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wrangler Wizard",
  description:
    "Generate wrangler.jsonc files and Cloudflare CLI commands from plain English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full bg-transparent text-neutral-100">{children}</body>
    </html>
  );
}