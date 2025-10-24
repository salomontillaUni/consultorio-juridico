'use client';
import { LoginForm } from "@/components/global/LoginForm";
import { GeometricBackground } from "@/components/global/GeometricBackground";
import {Logo} from "@/components/global/LogoUac";

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-blue-100 to-blue-200">
      <GeometricBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-foreground mb-2 drop-shadow-sm mt-4">Consultorio Juridico</h1>
          <p className="text-muted-foreground">Consultorio Juridico de la Corporacion Universitaria Autonoma del Cauca</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
