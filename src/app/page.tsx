'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale, Users, BookOpen } from 'lucide-react';

interface PaginaPrincipalProps {
  onCrearCaso: () => void;
}

export default function PaginaPrincipal({ onCrearCaso }: PaginaPrincipalProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-slate-900">Gestión de Casos</h3>
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
              <a
                href='/pro-apoyo/crear-caso'
              >
                Crear Caso
              </a>
              <p className="text-sm text-slate-600">
                Registra un usuario nuevo que solicita asesoria
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-slate-900">Documentación</h3>
              <p className="text-sm text-slate-600">
                Exporta y mantén registro de todos los casos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Botón principal */}
        <div className="flex justify-center pt-8">

        </div>

        {/* Footer info */}
        <div className="text-center text-sm text-slate-500 pt-8">
          <p>Sistema de registro y gestión de casos legales</p>
        </div>
      </div>
    </div>
  );
}
