import { useState } from "react";
import { RegistroUsuario } from "./components/RegistroUsuario";
import { AsignacionCaso } from "./components/AsignacionCaso";
import { ResumenCaso } from "./components/ResumenCaso";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./components/StepIndicator";
import { on } from "events";

export interface Usuario {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correoElectronico: string;
}

export interface DatosCaso {
  usuario: Usuario;
  estudiante: any;
  asesor: any;
  fechaCreacion: string;
  observaciones: string;
}

export default function CreateCasePage({ onBack }: { onBack: () => void }) {
  const [seccionActual, setSeccionActual] = useState<"registro" | "asignacion" | "resumen">("registro");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [caso, setCaso] = useState<DatosCaso | null>(null);

  const handleRegistroCompleto = (usuarioData: Usuario) => {
    setUsuario(usuarioData);
    setSeccionActual("asignacion");
  };

  const handleCasoRegistrado = (casoData: DatosCaso) => {
    setCaso(casoData);
    setSeccionActual("resumen");
  };

  const handleRetroceder = () => {
    if (seccionActual === "asignacion") {
      setSeccionActual("registro");
    } else if (seccionActual === "resumen") {
      setSeccionActual("asignacion");
    }
  };

  const handleNuevoCaso = () => {
    setUsuario(null);
    setCaso(null);
    setSeccionActual("registro");
    onBack();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center p-4">

      <div className="mb-6 max-w-3xl w-full flex flex-col gap-2">
        <div className="flex flex-col items-center justify-between">
          <StepIndicator currentStep={seccionActual} />
          {seccionActual !== "registro"  && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetroceder}
              className="text-blue-600 hover:bg-blue-50 transition-colors"
            >
              ← Retroceder
            </Button>
          )}
        </div>
      </div>

      {/* Contenido dinámico */}
      {seccionActual === "registro" && (
        <RegistroUsuario
          onContinuar={handleRegistroCompleto}
          datosIniciales={usuario}
        />
      )}
      {seccionActual === "asignacion" && usuario && (
        <AsignacionCaso
          usuario={usuario}
          datosIniciales={caso}
          onCasoRegistrado={handleCasoRegistrado}
        />
      )}
      {seccionActual === "resumen" && caso && (
        <ResumenCaso
          caso={caso}
          onNuevoCaso={handleNuevoCaso}
        />
      )}
    </div>
  );
}
