import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniReach CRM",
  description: "AI-powered omnichannel lead management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise">{children}</body>
    </html>
  );
}
