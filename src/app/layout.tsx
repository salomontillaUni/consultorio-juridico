import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/sonner";

import IdleTimerProvider from "@/components/global/IdleTimerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consultorio Juridico UAC",
  description: "Consultorio Juridico UAC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IdleTimerProvider />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
