'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale, Users, BookOpen } from 'lucide-react';
import NavbarProApoyo from './components/NavBarProApoyo';
import GestionCasosPage from './gestionar-caso/GestionCasoPage';
import { useState } from 'react';
import CreateCasePage from './crear-caso/CreateCasePage';
import { Button } from '@/components/ui/button';

export default function PaginaPrincipal() {
  const [currentPage, setCurrentPage] = useState<'inicio' | 'cases' | 'create'>('inicio');
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const handleNavigateToCases = () => {
    setCurrentPage("cases");
  };

  const handleNavigateToCreate = () => {
    setCurrentPage("create");
  };

  const handleNavigateHome = () => {
    setCurrentPage("inicio");
  };

  const handleNavigate = (page: "inicio" | "cases" | "create") => {
    setCurrentPage(page);
    setSelectedCaseId(null);
  };

  if (currentPage === "cases") {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarProApoyo currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 bg-gray-50">
          <GestionCasosPage onBack={handleNavigateHome} />
        </main>
      </div>
    );
  }
  
  if (currentPage === "create") {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarProApoyo currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 bg-gray-50">
          <CreateCasePage onBack={handleNavigateHome} />
        </main>
      </div>
    );
  }
  
  return (
    <div>
      <NavbarProApoyo currentPage="inicio" onNavigate={handleNavigate} />
      <div className="h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-blue-600 rounded-full shadow-2xl">
                <Scale className="h-16 w-16 text-white" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-5xl text-slate-900 tracking-tight">
              Consultorio Jurídico
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Sistema de gestión y registro de casos legales
            </p>
          </div>

          {/* Cards de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <Button 
                  onClick={() => handleNavigate("cases")}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md transition-colors duration-200 w-full"
                >
                  Gestion de Casos
                </Button>
                <p className="text-sm text-slate-600">
                  Registro y seguimiento completo de cada caso legal
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <Button 
                  onClick={() => handleNavigate("create")}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md transition-colors duration-200 w-full"
                >
                  Crear nuevo caso
                </Button>
                <p className="text-sm text-slate-600">
                  Registra un usuario nuevo que solicita asesoria
                </p>
              </CardContent>
            </Card>

          </div>



        </div>
      </div>
    </div>
  );
}
