import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Connect Animal — race the computer on a tile-matching grid",
  description:
    "Web port of the Pikachu / Onet animal-matching game. Match pairs whose connecting path makes at most two turns. Play vs. an Easy / Medium / Hard computer.",
  applicationName: "Connect Animal",
  authors: [{ name: "Vinh Nguyen" }],
  openGraph: {
    title: "Connect Animal",
    description: "Match pairs of animal tiles connected by a path with at most two turns.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
