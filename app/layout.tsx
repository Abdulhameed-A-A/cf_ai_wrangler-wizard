import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wrangler Wizard | Cloudflare Project Bootstrapper",
  description:
    "Turn plain-English descriptions into ready-to-use Cloudflare wrangler.jsonc configurations and execution commands instantly. Built with Workers AI.",
  keywords: ["Cloudflare", "Wrangler", "Workers AI", "Serverless", "Edge", "Next.js", "D1", "R2", "KV"],
  authors: [{ name: "Cloudflare Developer" }],
  openGraph: {
    title: "Wrangler Wizard | Cloudflare Project Bootstrapper",
    description: "Turn plain-English descriptions into ready-to-use Cloudflare configurations and CLI commands instantly. Powered by Workers AI.",
    url: "https://wrangler-wizard.pages.dev",
    siteName: "Wrangler Wizard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wrangler Wizard | Bootstrapper for Cloudflare Workers",
    description: "Describe your project in plain English -> Instantly get your wrangler.jsonc and C3 commands.",
  },
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