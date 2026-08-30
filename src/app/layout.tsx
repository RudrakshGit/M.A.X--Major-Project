import { themeColors } from "./theme-colors";
import type { Metadata, Viewport } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  themeColor: themeColors.surface,
};

export const metadata: Metadata = {
  title: "M.A.X",
  description: "A stigma-free mental health support system for students in higher education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.variable} font-sans bg-surface text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
