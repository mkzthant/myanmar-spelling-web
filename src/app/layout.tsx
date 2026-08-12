import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Myanmar Spelling Dictionary | မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း",
  description: "A modern web application for the 2003 Myanmar Spelling Dictionary (မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
