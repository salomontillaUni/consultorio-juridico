'use client';
import React from 'react';
import { Navbar } from '../../../components/NavBarEstudiante';
import { UserRegistrationForm } from './components/UserRegistrationForm';
import { GeometricBackground } from "./components/geometricBackground";

export default function App({ params }: { params: Promise<{ id_caso: string }> }) {
  const { id_caso } = React.use(params);
  return (
    <div>
      <Navbar />
      <main>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-blue-100 to-blue-200">
          <GeometricBackground />
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10 bg-white p-8 rounded-2xl shadow-md">
              <h1 className="mb-4 text-3xl text-blue-900">
                Formulario de Entrevista
              </h1>
              <p className="text-blue-800 text-lg max-w-2xl mx-auto">
                Completa los campos necesarios de tu <span className="font-semibold">entrevista</span>.
              </p>
            </div>
            <UserRegistrationForm idCaso={id_caso} />
          </div>
        </div>
      </main>
    </div>

  );
}