"use client";

import { Logo } from "./LogoUac";
import { Mail, Globe, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 border-t border-blue-100 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Info de la Institución */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Logo className="h-16 w-16" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  Consultorio Jurídico
                </span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Uniautónoma
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Plataforma profesional para la gestión eficiente de casos legales
              y entrevistas. Simplificamos el trabajo legal con herramientas
              modernas, seguras y accesibles.
            </p>
          </div>

          {/* Soporte */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider">
              Soporte
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:fabsoft_uac@gmail.com"
                  className="group flex items-center text-gray-600 hover:text-blue-600 text-sm transition-all"
                >
                  <Mail className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" />
                  Contacto soporte
                </a>
              </li>
              <li>
                <a
                  href="/centro-ayuda"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a
                  href="#privacidad"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider">
              Institución
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://portal.uniautonoma.edu.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-600 hover:text-blue-600 text-sm transition-all"
                >
                  <Globe className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" />
                  Universidad
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Consultorio Jurídico. Todos los
                derechos reservados.
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Esta página fue realizada por{" "}
                <span className="text-blue-500 font-semibold">
                  La Fábrica de Software
                </span>
              </p>
            </div>
            <div className="flex space-x-6">
              <span className="text-xs text-gray-400">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
