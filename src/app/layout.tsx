import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/app-provider";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import JotaiProvider from "@/providers/jotai-provider";
import ReactQueryProvider from "@/providers/react-query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HireReady AI - AI-Powered Interview Preparation Platform",
  description:
    "Master your job interviews with HireReady AI. Get personalized AI interview practice, resume analysis, and real-time feedback to land your dream job.",
  icons: {
    icon: [
      {
        url: "/assets/HR-Logo.png",
        type: "image/png",
      },
    ],
    shortcut: "/assets/HR-Logo.png",
    apple: "/assets/HR-Logo.png",
  },
  openGraph: {
    title: "HireReady AI - AI-Powered Interview Preparation",
    description:
      "Master your job interviews with personalized AI practice and feedback",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${inter.className}`}>
        <body>
          <JotaiProvider>
            <ReactQueryProvider>
              <AppProvider>{children}</AppProvider>
            </ReactQueryProvider>
          </JotaiProvider>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
