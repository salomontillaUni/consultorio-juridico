"use client";
import { Logo } from "@/components/global/LogoUac";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProApoyoProps {
  currentPage?: string;
  onNavigate?: (page: "inicio" | "cases" | "create") => void;
}

export default function NavbarProApoyo({
  currentPage = "cases",
  onNavigate,
}: NavbarProApoyoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <button
              onClick={() => onNavigate?.("inicio")}
              className="flex items-center hover:opacity-80 cursor-pointer transition-opacity duration-200"
            >
              <Logo className="h-12 w-12" />
              <span className="ml-2 text-xl text-gray-900">Consultorio Jurídico</span>
              <div className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                Profesional de Apoyo
              </div>
            </button>
          </div>

          {/* Botón hamburguesa (solo móvil) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menú de escritorio */}
          <nav className="hidden md:flex space-x-8">
            
            <button
              onClick={() => onNavigate?.("inicio")}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === "inicio"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate?.("cases")}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === "cases"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              Gestionar casos
            </button>
            <button
              onClick={() => onNavigate?.("create")}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === "create"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              Crear caso
            </button>
          </nav>
        </div>

        {/* Menú móvil (aparece solo cuando isOpen = true) */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 mt-2">
              <button
                onClick={() => {
                  onNavigate?.("inicio");
                  setIsOpen(false);
                }}
                className={`block px-3 py-2 rounded-md w-full text-left transition-colors duration-200 ${
                  currentPage === "inicio"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  onNavigate?.("cases");
                  setIsOpen(false);
                }}
                className={`block px-3 py-2 rounded-md w-full text-left transition-colors duration-200 ${
                  currentPage === "cases"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Gestionar casos
              </button>
              <button
                onClick={() => {
                  onNavigate?.("create");
                  setIsOpen(false);
                }}
                className={`block px-3 py-2 rounded-md w-full text-left transition-colors duration-200 ${
                  currentPage === "create"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Crear caso
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
