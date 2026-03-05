"use client";
import { LoginForm } from "@/components/global/LoginForm";
import { GeometricBackground } from "@/components/global/GeometricBackground";
import { Logo } from "@/components/global/LogoUac";
import { Scale } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen relative flex w-full bg-slate-50 overflow-hidden">
      {/* Background for overall aesthetic */}
      <GeometricBackground />

      {/* Left Branding Area - Hidden on small screens, shows on lg */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative z-10 p-12 bg-linear-to-br from-blue-700/90 to-blue-900/90 backdrop-blur-sm text-white border-r border-blue-800/30">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <Scale
            className="absolute -bottom-24 -left-24 w-[600px] h-[600px] text-white transform -rotate-12"
            strokeWidth={0.5}
          />
        </div>

        <div className="flex flex-col items-center max-w-lg text-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          
            <Logo className="h-48 w-48 text-white drop-shadow-xl" />
         

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight drop-shadow-md">
              Consultorio Jurídico
            </h1>
            <p className="text-blue-100 text-lg xl:text-xl font-medium leading-relaxed">
              Corporación Universitaria Autónoma del Cauca
            </p>
          </div>

          <div className="w-24 h-1.5 bg-yellow-400 rounded-full mt-4 shadow-sm"></div>
        </div>
      </div>

      {/* Right Login Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 p-6 sm:p-12 lg:p-16">
        {/* Mobile Header (Only visible when Left Branding is hidden) */}
        <div className="lg:hidden flex flex-col items-center text-center mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          
            <Logo className="h-24 w-24 text-white" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Consultorio Jurídico
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Uniautónoma del Cauca
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
