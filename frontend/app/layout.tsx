import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import GoogleProvider from "./providers/GoogleProviders"; // <-- client wrapper
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "HireSmart - AI-Powered Recruitment Platform",
  description:
    "Streamline your hiring process with intelligent resume analysis and candidate management.",
};

export const viewport: Viewport = {
  themeColor: "#3366CC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <GoogleProvider>{children}</GoogleProvider>
        <Analytics />
      </body>
    </html>
  );
}