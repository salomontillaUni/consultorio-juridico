import { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { RegistroUsuario } from './components/RegistroUsuario';
import { AsignacionCaso } from './components/AsignacionCaso';
import { ResumenCaso } from './components/ResumenCaso';

export interface Usuario {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correoElectronico: string;
}

export interface DatosCaso {
  usuario: Usuario;
  estudiante: {
    id: number;
    nombre: string;
    semestre: string;
    turno: string;
    casosActuales: number;
  };
  asesor: {
    id: number;
    nombre: string;
    area: string;
    turno: string;
  };
  fechaCreacion: string;
  observaciones: string;
}

export default function App() {
  const [seccionActual, setSeccionActual] = useState<'registro' | 'asignacion' | 'resumen'>('registro');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [caso, setCaso] = useState<DatosCaso | null>(null);

  const handleRegistroCompleto = (datosUsuario: Usuario) => {
    setUsuario(datosUsuario);
    setSeccionActual('asignacion');
  };

  const handleCasoRegistrado = (datosCaso: DatosCaso) => {
    setCaso(datosCaso);
    setSeccionActual('resumen');
  };

  const handleNuevoCaso = () => {
    setUsuario(null);
    setCaso(null);
    setSeccionActual('registro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Indicador de pasos centrado */}
        <StepIndicator currentStep={seccionActual} />
        
        {/* Contenido de cada sección */}
        {seccionActual === 'registro' && (
          <RegistroUsuario onContinuar={handleRegistroCompleto} />
        )}
        {seccionActual === 'asignacion' && usuario && (
          <AsignacionCaso 
            usuario={usuario} 
            onCasoRegistrado={handleCasoRegistrado}
          />
        )}
        {seccionActual === 'resumen' && caso && (
          <ResumenCaso 
            caso={caso}
            onNuevoCaso={handleNuevoCaso}
          />
        )}
      </div>
    </div>
  );
}
