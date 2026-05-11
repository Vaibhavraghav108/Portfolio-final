import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vaibhav Raghav | AI Engineer",
  description:
    "Neural Terminal Portfolio of Vaibhav Raghav, AI Engineer and B.Tech CSE (Artificial Intelligence) student specializing in Generative AI, Computer Vision, and Predictive Modeling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-mono">{children}</body>
    </html>
  );
}
