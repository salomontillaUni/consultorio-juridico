"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  User,
  MapPin,
  Briefcase,
  FileText,
  Scale,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { ProgressIndicator } from "@radix-ui/react-progress";
import { Caso, Demandado } from "app/types/database";
import { getCasoById } from "../../../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../../../supabase/queries/getDemandadoByCasoId";
import { supabase } from "@/utils/supabase/supabase";
import { Switch } from "@/components/ui/switch";
import { Tienne } from "next/font/google";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { cleanData } from "@/utils/utils";
import {
  Step1InfoEntrevista,
  Step2InfoSolicitante,
  Step3QuienSolicita,
  Step4InfoLaboral,
  Step5DatosAccionado,
  Step6InfoContrato,
  Step7DetallesCaso,
  Step8Firmas,
} from "./FormSteps";

const STEPS = [
  { id: 1, title: "Información de la Entrevista", icon: CalendarDays },
  { id: 2, title: "Información del Solicitante", icon: User },
  { id: 3, title: "¿Quién solicita el servicio?", icon: Scale },
  { id: 4, title: "Información Laboral y Financiera", icon: Briefcase },
  { id: 5, title: "Datos del Demandado", icon: MapPin },
  { id: 6, title: "Información del Contrato Laboral", icon: FileText },
  { id: 7, title: "Detalles del Caso", icon: FileText },
  { id: 8, title: "Firmas y Autorización", icon: CheckCircle },
];

export function UserRegistrationForm({ idCaso }: { idCaso: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>();
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  async function traerDatos() {
    try {
      setLoading(true);
      setError("");
      const [
        casoFetch,
        demandadoFetch,
        {
          data: { user },
        },
      ] = await Promise.all([
        getCasoById(idCaso),
        getDemandadoByCasoId(idCaso),
        supabase.auth.getUser(),
      ]);
      setCurrentUserId(user?.id || null);
      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);
      setDemandado(demandadoFetch);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    traerDatos();
  }, []);

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const initialFormData = {
    // Interview Information
    area: "",

    // Informacion Solicitante
    edad: "",
    contacto_familiar: "",
    estado_civil: "",
    estrato: "",
    direccion: "",
    tipo_vivienda: "",
    tiene_representado: "",

    // Informacion Financiera
    situacion_laboral: "",
    otros_ingresos: false,
    valor_otros_ingresos: "",
    concepto_otros_ingresos: "",
    tiene_contrato: false,

    // Defendant Information
    nombreDemandado: "",
    documentoDemandado: "",
    celularDemandado: "",
    lugarResidenciaDemandado: "",
    correoDemandado: "",

    // Employment Contract Information
    tipoContrato: "",
    nombreRepresentanteLegal: "",
    direccionEmpresa: "",
    correoEmpleador: "",
    fechaInicio: "",
    fechaTerminacion: "",
    continuaContrato: false,
    salarioInicial: "",
    salarioActual: "",

    // Case Information
    resumen_hechos: "",
    observaciones: "",

    // Signatures
    firmasSolicitante: false,
    cedulaSolicitante: "",
  };

  type FormData = typeof initialFormData;

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`entrevista_draft_${idCaso}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to restore draft", e);
        }
      }
    }
    return initialFormData;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `entrevista_draft_${idCaso}`,
        JSON.stringify(formData),
      );
    }
  }, [formData, idCaso]);

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // No required fields
      case 2:
        return !!(
          formData.direccion &&
          formData.edad &&
          formData.estado_civil &&
          formData.estrato &&
          formData.tipo_vivienda
        );
      case 3:
        return !!formData.tiene_representado;
      case 4:
        return !!formData.situacion_laboral;
      case 5:
        return !!formData.nombreDemandado;
      case 6:
        return true; // Optional section
      case 7:
        return !!formData.area; // Area is required
      case 8:
        return !!(formData.firmasSolicitante && formData.cedulaSolicitante);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = cleanData(formData);
    if (!validateStep(8)) return;

    try {
      //Actualizar caso
      const { error: errorCaso } = await supabase
        .from("casos")
        .update({
          area: limpio.area,
          resumen_hechos: limpio.resumen_hechos,
          observaciones: limpio.observaciones,
          estado: "pendiente_aprobacion",
        })
        .eq("id_caso", idCaso);

      if (errorCaso)
        throw new Error(`Error actualizando caso: ${errorCaso.message}`);

      //Actualizar usuario
      const { error: errorUsuario } = await supabase
        .from("usuarios")
        .update({
          edad: Number(limpio.edad),
          contacto_familiar: limpio.contacto_familiar,
          estado_civil: limpio.estado_civil,
          estrato: Number(limpio.estrato),
          direccion: limpio.direccion,
          tipo_vivienda: limpio.tipo_vivienda,
          situacion_laboral: limpio.situacion_laboral,
          otros_ingresos: limpio.otros_ingresos,
          valor_otros_ingresos: Number(limpio.valor_otros_ingresos),
          concepto_otros_ingresos: limpio.concepto_otros_ingresos,
          tiene_contrato: limpio.tiene_contrato,
          tiene_representado: limpio.tiene_representado,
        })
        .eq("id_usuario", caso?.id_usuario);

      if (errorUsuario)
        throw new Error(`Error actualizando usuario: ${errorUsuario.message}`);

      //Actualizar contrato laboral
      const { error: errorContrato } = await supabase
        .from("contratos_laborales")
        .insert({
          id_usuario: caso?.id_usuario,
          tipo_contrato: limpio.tipoContrato,
          representante_legal: limpio.nombreRepresentanteLegal,
          correo_patrono: limpio.correoEmpleador,
          direccion_empresa: limpio.direccionEmpresa,
          fecha_inicio: limpio.fechaInicio,
          fecha_fin: limpio.fechaTerminacion,
          continua: limpio.continuaContrato,
          salario_inicial: limpio.salarioInicial,
          salario_actual: limpio.salarioActual,
        });

      if (errorContrato)
        throw new Error(
          `Error actualizando contrato: ${errorContrato.message}`,
        );

      //Actualizar demandado
      const { error: errorDemandado } = await supabase
        .from("demandados")
        .insert({
          id_caso: idCaso,
          nombre_completo: limpio.nombreDemandado,
          documento: limpio.documentoDemandado,
          celular: limpio.celularDemandado,
          lugar_residencia: limpio.lugarResidenciaDemandado,
          correo: limpio.correoDemandado,
        });

      if (errorDemandado)
        throw new Error(
          `Error actualizando demandado: ${errorDemandado.message}`,
        );

      setOpen(true);
      if (typeof window !== "undefined") {
        localStorage.removeItem(`entrevista_draft_${idCaso}`);
      }
      router.push(`/estudiante/mis-casos`);
      clearForm();
    } catch (err) {
      console.error("❌ Error durante la actualización:", err);
      alert(`Ocurrió un error: ${(err as Error).message}`);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;
  const currentStepData = STEPS.find((step) => step.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1InfoEntrevista caso={caso} currentUserId={currentUserId} formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <Step2InfoSolicitante caso={caso} formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <Step3QuienSolicita formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <Step4InfoLaboral formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <Step5DatosAccionado formData={formData} handleInputChange={handleInputChange} />;
      case 6:
        return <Step6InfoContrato formData={formData} handleInputChange={handleInputChange} />;
      case 7:
        return <Step7DetallesCaso formData={formData} handleInputChange={handleInputChange} />;
      case 8:
        return <Step8Firmas formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium">
          Cargando formulario...
        </p>
      </div>
    );
  }

  if (error && !caso) {
    return (
      <Card className="p-8 text-center border-red-200 bg-red-50">
        <p className="text-red-600 font-medium">{error}</p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4"
        >
          Volver
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Progress Bar Container */}
      <div className="backdrop-blur-md bg-white/70 border border-white/20 p-6 rounded-2xl shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inscripción de Caso
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Paso {currentStep} de {STEPS.length}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600">
              {Math.round(progress)}%
            </span>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Completado
            </p>
          </div>
        </div>

        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
          <div
            className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Title Integrated */}
        {currentStepData && (
          <div className="flex items-center gap-3 mt-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="p-2 bg-blue-600 rounded-lg shadow-blue-200 shadow-lg">
              <currentStepData.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-none">
                {currentStepData.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Por favor, complete la información requerida en esta sección.
              </p>
            </div>
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {successMessage.includes("✅")
                ? "Actualización Exitosa"
                : "Error"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button onClick={() => setOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!validateStep(8)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Enviar Formulario
            </Button>
          )}
        </div>
      </form>

      {/* Step Indicators */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isDisabled = step.id > currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (!isDisabled) setCurrentStep(step.id);
                }}
                disabled={isDisabled}
                className={`
                  relative group transition-all duration-300 flex items-center justify-center
                  ${isCurrent ? "w-10" : "w-3"} h-3 rounded-full
                  ${isCurrent ? "bg-blue-600 shadow-md shadow-blue-200" : isCompleted ? "bg-green-500" : "bg-slate-300"}
                  ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}
                `}
                aria-label={`Ir al paso ${step.id}: ${step.title}`}
              >
                {isCurrent && (
                  <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                    {step.id}
                  </span>
                )}
                {/* Tooltip on hover */}
                {!isDisabled && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {step.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
