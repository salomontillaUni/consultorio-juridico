"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/global/LogoUac";
import LogoutButton from "@/components/global/LogoutBtn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/inicio", label: "Inicio" },
    { href: "/admin/estudiantes", label: "Estudiantes" },
    { href: "/admin/asesores", label: "Asesores" },
    { href: "/admin/proapoyo", label: "Proapoyo" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <button 
              onClick={() => window.location.href='/admin/inicio'}
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Logo className="h-15 w-15" />
              <span className="ml-2 text-xl text-gray-900">Consulorio Jurídico</span>
              <div className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                Admin
              </div>
            </button>
          </div>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <ul className="hidden md:flex space-x-4 items-center">
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
          <li>
            <LogoutButton></LogoutButton>
          </li>
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
                className={`block px-3 py-2 rounded-md text-sm text-center ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
            <LogoutButton></LogoutButton>
        </div>
      )}
    </nav>
  );
}
