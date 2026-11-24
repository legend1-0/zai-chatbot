import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "z.ai Chatbot",
  description: "Minimal chatbot powered by the z.ai API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
