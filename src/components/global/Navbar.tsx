"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/global/LogoUac";
import LogoutButton from "@/components/global/LogoutBtn";

export interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  roleName: string;
  basePath: string;
  links: NavLink[];
}

export function Navbar({ roleName, basePath, links }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center h-16">
        {/* Logo/Brand */}
        <div className="shrink-0 flex items-center">
          <Link
            href={basePath}
            className="flex items-center hover:opacity-80 transition-opacity duration-200 gap-2 sm:gap-3"
          >
            <Logo className="h-10 w-10 sm:h-12 sm:w-12 shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg md:text-xl text-gray-900 font-bold tracking-tight leading-none">
                Consultorio Jurídico
              </span>
              <span className="text-[10px] sm:text-xs text-blue-600 font-semibold uppercase tracking-wider mt-1">
                Panel {roleName}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-1 lg:space-x-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== basePath && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-slate-200">
            <LogoutButton />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-sm absolute w-full shadow-lg origin-top animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== basePath && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-slate-100 px-2 flex justify-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
