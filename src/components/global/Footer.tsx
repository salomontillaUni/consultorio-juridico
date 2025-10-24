'use client'

import { Logo } from "./LogoUac";

export default function Footer() {
    return (
        <footer className="bg-blue-50 border-t border-blue-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <Logo className="h-20 w-20" />
                            <span className="ml-2 text-xl text-gray-900">Consulorio Jurídico</span>
                        </div>
                        <p className="text-gray-600 text-sm max-w-md">
                            Plataforma profesional para la gestión eficiente de casos legales y entrevistas.
                            Simplificamos tu trabajo legal con herramientas modernas y seguras.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-gray-900 font-medium mb-4">Enlaces rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#mis-casos" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Mis casos
                                </a>
                            </li>
                            <li>
                                <a href="#entrevista" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Entrevista
                                </a>
                            </li>
                            <li>
                                <a href="#documentos" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Documentos
                                </a>
                            </li>
                            <li>
                                <a href="#configuracion" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Configuración
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-gray-900 font-medium mb-4">Soporte</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#ayuda" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Centro de ayuda
                                </a>
                            </li>
                            <li>
                                <a href="#contacto" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Contacto
                                </a>
                            </li>
                            <li>
                                <a href="#privacidad" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Privacidad
                                </a>
                            </li>
                            <li>
                                <a href="#terminos" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200">
                                    Términos de uso
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-8 pt-8 border-t border-blue-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2025 Consulorio Jurídico. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}