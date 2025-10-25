'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale } from 'lucide-react';
import { Navbar } from '../components/NavBarAsesor';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PaginaPrincipal() {
  const router = useRouter();

  const handleNavigateToMisCasos = () => {
    router.push("/asesor/mis-casos");
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Header */}
          <header className="space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-blue-600 rounded-full shadow-2xl">
                <Scale className="h-16 w-16 text-white" strokeWidth={2} />
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-semibold text-slate-900 tracking-tight">
                Consultorio Jurídico
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
                Sistema integral para la gestión y registro de casos legales
              </p>
            </div>
          </header>

          {/* Cards de información */}
          <section className="flex justify-center">
            <Card className="w-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <Button 
                  onClick={handleNavigateToMisCasos}
                  className="min-w-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                >
                  Mis Casos
                </Button>

                <p className="text-sm text-slate-600">
                  Consulta, registra y da seguimiento a tus casos activos.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
