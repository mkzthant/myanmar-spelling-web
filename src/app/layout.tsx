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
  title: "မြန်မာစာလုံးပေါင်းသတ်ပုံ | Myanmar Spelling Dictionary",
  description: "မြန်မာစာအဖွဲ့မှ ထုတ်ဝေသော စာလုံးပေါင်းသတ်ပုံကျမ်း (၂၀၀၃) ကို အလွယ်တကူ ရှာဖွေနိုင်သော Web App ဖြစ်ပါသည်။",
  keywords: ["မြန်မာစာ", "သတ်ပုံ", "Myanmar", "Spelling", "Dictionary", "မြန်မာစာလုံးပေါင်းသတ်ပုံကျမ်း"],
  openGraph: {
    title: "မြန်မာစာလုံးပေါင်းသတ်ပုံ | Myanmar Spelling Dictionary",
    description: "မြန်မာစာအဖွဲ့မှ ထုတ်ဝေသော စာလုံးပေါင်းသတ်ပုံကျမ်း (၂၀၀၃) ကို အလွယ်တကူ ရှာဖွေနိုင်သော Web App",
    url: "https://mkzthant.github.io/",
    siteName: "Myanmar Spelling Dictionary",
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Myanmar_Seal.svg/512px-Myanmar_Seal.svg.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "my_MM",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#121212",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
