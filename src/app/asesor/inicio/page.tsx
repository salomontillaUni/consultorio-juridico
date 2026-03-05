"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, ChevronRight } from "lucide-react";
import { Navbar } from "../components/NavBarAsesor";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaginaPrincipal() {
  const router = useRouter();

  const handleNavigateToMisCasos = () => {
    router.push("/asesor/mis-casos");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-10 sm:space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header */}
          <header className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-xl shadow-blue-600/20 flex items-center justify-center">
              <Scale
                className="h-10 w-10 sm:h-12 sm:w-12 text-white"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                Panel del{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                  Asesor
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                Plataforma integral para la gestión, seguimiento y supervisión
                de casos legales.
              </p>
            </div>
          </header>

          {/* Acciones Rápidas */}
          <section className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-xl mx-auto">
            <Card
              className="group cursor-pointer border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 bg-white/50 backdrop-blur-sm overflow-hidden"
              onClick={handleNavigateToMisCasos}
            >
              <CardContent className="p-8 sm:p-10 text-center space-y-6 flex flex-col items-center">
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <FileText className="h-8 w-8" strokeWidth={2} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Mis Casos
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    Accede a la lista de casos asignados, revísalos y aprueba
                    las acciones de los estudiantes.
                  </p>
                </div>
                <Button className="w-full sm:w-auto mt-4 px-8 bg-slate-900 hover:bg-blue-600 text-white rounded-full transition-all duration-300 gap-2">
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
