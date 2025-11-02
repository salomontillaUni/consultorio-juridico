'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale } from 'lucide-react';
import {Navbar} from '../components/NavBarEstudiante';
import { Button } from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import { GeometricBackground } from '@/components/global/GeometricBackground';

export default function PaginaPrincipal() {
  const router = useRouter();
  const handleNavigateToMisCasos = () => {
    router.push("/estudiante/mis-casos");
  };


  return (
    <div>
      <Navbar/>
      <div className="h-[calc(100vh-4rem)] z-10 bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-4xl min-w-xl flex flex-col justify-center items-center space-y-8">
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
          <div className="flex gap-6 mt-12">
            <Card className="border-2 w-full hover:border-blue-200 transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <Button 
                  onClick={() => handleNavigateToMisCasos()}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md transition-colors duration-200 w-full"
                >
                  Mis casos
                </Button>
                <p className="text-sm text-slate-600">
                  Registro y seguimiento completo de tus casos
                </p>
              </CardContent>
            </Card>

          </div>



        </div>
      </div>
    </div>
  );
}
