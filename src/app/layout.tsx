import type { Metadata, Viewport } from "next";
import { Padauk } from "next/font/google";
import "./globals.css";

const padauk = Padauk({
  variable: "--font-padauk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#121212",
};

export const metadata: Metadata = {
  title: "မြန်မာစာလုံးပေါင်းသတ်ပုံ | Myanmar Spelling Dictionary",
  description: "မြန်မာစာအဖွဲ့မှ ထုတ်ဝေသော စာလုံးပေါင်းသတ်ပုံကျမ်း (၂၀၀၃) ကို အလွယ်တကူ ရှာဖွေနိုင်သော Web App ဖြစ်ပါသည်။",
  keywords: ["မြန်မာစာ", "သတ်ပုံ", "Myanmar", "Spelling", "Dictionary", "မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း"],
  openGraph: {
    title: "မြန်မာစာလုံးပေါင်းသတ်ပုံ | Myanmar Spelling Dictionary",
    description: "မြန်မာစာအဖွဲ့မှ ထုတ်ဝေသော စာလုံးပေါင်းသတ်ပုံကျမ်း (၂၀၀၃) ကို အလွယ်တကူ ရှာဖွေနိုင်သော Web App",
    url: "https://mm-spelling.mnote.pp.ua/",
    siteName: "မြန်မာစာလုံးပေါင်းသတ်ပုံ",
    images: [
      {
        url: "https://mm-spelling.mnote.pp.ua/icon.svg",
        width: 512,
        height: 512,
      },
    ],
    locale: "my_MM",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="my">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={padauk.variable}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
