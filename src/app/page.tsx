'use client';
import { LoginForm } from "@/components/global/LoginForm";
import { GeometricBackground } from "@/components/global/GeometricBackground";
import Image from 'next/image';

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-blue-100 to-blue-200">
      <GeometricBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl mb-6 shadow-xl shadow-blue-500/25">
            <Image src="/logo_uniautonoma_blanco.svg" alt="Logo" width={90} height={80} />
          </div>
          <h1 className="text-foreground mb-2 drop-shadow-sm">Consultorio Juridico</h1>
          <p className="text-muted-foreground">Consultorio Juridico de la Corporacion Universitaria Autonoma del Cauca</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}