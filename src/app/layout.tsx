import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexCRM – AI-Powered Sales & Hiring Platform",
  description: "Outreach automation, recruitment management, and unified communications in one platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
