"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/global/LogoUac";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/pro-apoyo/inicio", label: "Inicio" },
    { href: "/pro-apoyo/gestionar-caso", label: "Casos" },
    { href: "/pro-apoyo/crear-caso", label: "Crear Caso" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <button 
              onClick={() => window.location.href='/pro-apoyo/inicio'}
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Logo className="h-15 w-15" />
              <span className="ml-2 text-xl text-gray-900">Consulorio Jurídico</span>
              <div className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                Profesional de Apoyo
              </div>
            </button>
          </div>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <ul className="hidden md:flex space-x-4">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden border-t border-gray-200 px-4 py-2">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
