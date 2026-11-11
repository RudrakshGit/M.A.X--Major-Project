import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Inter, Kalam } from "next/font/google";
import "./globals.css";
import { themeColors } from "./theme-colors";

// The app's fonts: Inter for headings, Atkinson Hyperlegible Next for reading, Kalam for the hand-drawn touches.
const head = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-head", display: "swap" });
const body = Atkinson_Hyperlegible_Next({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-body", display: "swap" });
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-kalam", display: "swap" });

export const viewport: Viewport = { themeColor: themeColors.paper };

export const metadata: Metadata = {
  metadataBase: new URL("https://max-mental-health-expert.vercel.app"),
  title: { default: "MAX, a wellbeing companion for college students", template: "%s · MAX" },
  description: "Check in, talk it out, try a calming tool, at any hour. Free and private. Try MAX in your browser or get the Android app.",
  icons: { icon: "/max.png", apple: "/max.png" },
  openGraph: { title: "MAX, a wellbeing companion for college students", description: "Free and private. Try it in your browser or get the Android app.", images: ["/max.png"] },
};

// The old MAX web app left a caching service worker in some browsers; this removes it (see public/sw.js too).
const unregisterOldWorker = `if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})})}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable} ${kalam.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <script dangerouslySetInnerHTML={{ __html: unregisterOldWorker }} />
      </body>
    </html>
  );
}
