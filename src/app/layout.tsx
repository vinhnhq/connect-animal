import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect Animal",
  description: "Match pairs of animal tiles connected by a path with at most two turns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
