import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavbarProApoyo from "./components/NavBarProApoyo";

export default function ProApoyoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <NavbarProApoyo />
        {children}
      </body>
    </html>
  );
}
