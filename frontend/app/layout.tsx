import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Orbitron,
  Inter,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuakeWatch",
  description:
    "Seismic Intelligence Platform with Fourier Transform Analysis and Impact Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${orbitron.variable}
        ${inter.variable}
      `}
    >
      <body
        className="
          min-h-screen
          bg-black
          text-white
          antialiased
          font-[var(--font-inter)]
        "
      >
        {children}
      </body>
    </html>
  );
}