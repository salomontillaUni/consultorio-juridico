import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { Asesor, Caso, Estudiante, Usuario } from "app/types/database";
import { getEstudiantes } from "../../../../../supabase/queries/getEstudiantes";
import { getAsesores } from "../../../../../supabase/queries/getAsesores";
import { SearchableSelector } from "@/components/SearchableSelector";

interface AsignacionCasoProps {
  usuario: Usuario;
  onCasoRegistrado: (caso: Caso) => void;
  datosIniciales?: Caso | null;
}

const casosMaximos = 5;

export function AsignacionCaso({
  usuario,
  onCasoRegistrado,
  datosIniciales,
}: AsignacionCasoProps) {
  const [estudianteId, setEstudianteId] = useState<string>("");
  const [asesorId, setAsesorId] = useState<string>("");
  const [observaciones, setObservaciones] = useState("");
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<
    Estudiante[]
  >([]);
  const [asesoresDisponibles, setAsesoresDisponibles] = useState<Asesor[]>([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Estudiante | null>(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState<Asesor | null>(
    null,
  );

  // Si vienen datos iniciales (por ejemplo al editar un caso)
  useEffect(() => {
    if (!datosIniciales) return;

    const estudianteAsignado =
      Array.isArray(datosIniciales.estudiantes_casos) &&
      datosIniciales.estudiantes_casos.length > 0
        ? datosIniciales.estudiantes_casos[0].estudiante
        : null;

    const asesorAsignado =
      Array.isArray(datosIniciales.asesores_casos) &&
      datosIniciales.asesores_casos.length > 0
        ? datosIniciales.asesores_casos[0].asesor
        : null;

    setEstudianteId(estudianteAsignado?.id_perfil?.toString() || "");
    setAsesorId(asesorAsignado?.id_perfil?.toString() || "");
    setObservaciones(datosIniciales.observaciones || "");
  }, [datosIniciales]);

  // Cargar estudiantes y asesores disponibles al montar
  useEffect(() => {
    const getData = async () => {
      try {
        const estudiantes = await getEstudiantes(true);
        setEstudiantesDisponibles(estudiantes);

        const asesores = await getAsesores(true);
        setAsesoresDisponibles(asesores);
      } catch (error) {
        console.error("Error al obtener estudiantes o asesores:", error);
        toast.error("Error al obtener estudiantes o asesores");
      }
    };

    getData();
  }, []);

  const handleRegistrarCaso = () => {
    if (!estudianteId || !asesorId) {
      console.error("Por favor complete todos los campos requeridos");
      return;
    }

    const estudiante = estudiantesDisponibles.find(
      (e) => e.id_perfil.toString() === estudianteId,
    );
    const asesor = asesoresDisponibles.find(
      (a) => a.id_perfil.toString() === asesorId,
    );

    if (!estudiante || !asesor) {
      console.error("No se pudo encontrar el estudiante o asesor seleccionado");
      return;
    }
    const datosCaso: Caso = {
      area: datosIniciales?.area || "otros",
      fecha_creacion:
        datosIniciales?.fecha_creacion || new Date().toISOString(),
      estado: datosIniciales?.estado || "en_proceso",
      usuarios: usuario,
      estudiantes_casos: [{ estudiante }],
      asesores_casos: [{ asesor }],
      observaciones,
    };

    onCasoRegistrado(datosCaso);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Información del profesional */}
      <Card className="bg-white/60 backdrop-blur-sm border-blue-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-blue-400 to-indigo-500" />
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </span>
            Información del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm">
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 transition-colors hover:bg-slate-50">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Nombre
              </span>
              <p
                className="font-medium text-slate-900 truncate"
                title={usuario.nombre_completo}
              >
                {usuario.nombre_completo}
              </p>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 transition-colors hover:bg-slate-50">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Sexo
              </span>
              <p className="font-medium text-slate-900">{usuario.sexo}</p>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 transition-colors hover:bg-slate-50">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Cédula
              </span>
              <p className="font-medium text-slate-900">{usuario.cedula}</p>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 transition-colors hover:bg-slate-50">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                Correo
              </span>
              <p
                className="font-medium text-slate-900 truncate"
                title={usuario.correo || ""}
              >
                {usuario.correo || "No registrado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Asignación */}
      <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-inner shadow-white/20">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">Asignación de Caso</CardTitle>
              <CardDescription className="text-sm">
                Complete la información para registrar el nuevo caso
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-8 px-4 sm:px-6">
          {/* Estudiante */}
          <div className="space-y-5 relative">
            <div className="absolute left-6 top-8 bottom-[-2rem] w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="relative z-10 hidden md:flex h-12 w-12 rounded-full bg-blue-50 border-4 border-white items-center justify-center shadow-sm">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-2 md:hidden mb-1">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Asignar Estudiante
                </h3>
              </div>
              <div className="hidden md:block">
                <h3 className="text-lg font-semibold text-slate-900">
                  Asignar a un estudiante
                </h3>
                <p className="text-sm text-slate-500">
                  Seleccione el practicante encargado del caso
                </p>
              </div>
            </div>

            <div className="md:pl-[4.5rem] w-full">
              <div className="space-y-2 max-w-full">
                <Label
                  htmlFor="estudiante"
                  className="text-slate-700 font-medium ml-1"
                >
                  Seleccionar estudiante *
                </Label>
                <div className="w-full">
                  <SearchableSelector
                    items={estudiantesDisponibles}
                    value={estudianteId}
                    onValueChange={setEstudianteId}
                    placeholder="Seleccione un estudiante"
                    searchPlaceholder="Buscar por nombre o cédula..."
                    getItemValue={(e) => e.id_perfil.toString()}
                    getItemLabel={(e) => e.perfil.nombre_completo}
                    getItemSearchValue={(e) => e.perfil.cedula || ""}
                    renderItem={(estudiante) => (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-2 gap-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-slate-800">
                            {estudiante.perfil.nombre_completo}
                          </span>
                          <span className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="font-medium font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              CC: {estudiante.perfil.cedula}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>Semestre: {estudiante.semestre}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Turno: {estudiante.turno}</span>
                          </span>
                        </div>
                        <Badge
                          variant={
                            estudiante.total_casos! >= casosMaximos
                              ? "destructive"
                              : "secondary"
                          }
                          className={cn(
                            "text-[10px] h-6 px-2.5 flex-shrink-0 self-start sm:self-auto",
                            estudiante.total_casos! === 0 &&
                              "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
                            estudiante.total_casos! > 0 &&
                              estudiante.total_casos! < casosMaximos &&
                              "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
                            estudiante.total_casos! >= casosMaximos &&
                              "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
                          )}
                        >
                          {estudiante.total_casos === 0
                            ? "0 casos asignados"
                            : `${estudiante.total_casos} ${estudiante.total_casos === 1 ? "caso" : "casos"} asignados`}
                        </Badge>
                      </div>
                    )}
                  />
                </div>
              </div>

              {(estudianteSeleccionado ||
                (estudianteId &&
                  estudiantesDisponibles.find(
                    (e) => e.id_perfil.toString() === estudianteId,
                  ))) && (
                <div className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      Detalles del Estudiante
                    </h4>
                  </div>

                  {(() => {
                    const est =
                      estudianteSeleccionado ||
                      estudiantesDisponibles.find(
                        (e) => e.id_perfil.toString() === estudianteId,
                      );
                    if (!est) return null;
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Nombre
                          </p>
                          <p
                            className="text-sm font-medium text-slate-700 truncate"
                            title={est.perfil.nombre_completo}
                          >
                            {est.perfil.nombre_completo}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Semestre
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            {est.semestre}º Semestre
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Turno / Jornada
                          </p>
                          <p
                            className="text-sm font-medium text-slate-700 truncate"
                            title={`${est.turno} (${est.jornada})`}
                          >
                            {est.turno}{" "}
                            <span className="text-slate-400 text-xs">
                              ({est.jornada})
                            </span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Carga
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-bold",
                                est.total_casos! >= casosMaximos
                                  ? "text-red-600"
                                  : "text-blue-600",
                              )}
                            >
                              {est.total_casos}/{casosMaximos}
                            </span>
                            <div className="h-1.5 flex-1 max-w-[4rem] bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full transition-all duration-500",
                                  est.total_casos! >= casosMaximos
                                    ? "bg-red-500"
                                    : "bg-blue-500",
                                )}
                                style={{
                                  width: `${Math.min((est.total_casos! / casosMaximos) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Asesor */}
          <div className="space-y-5 relative">
            <div className="absolute left-6 top-8 bottom-0 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="relative z-10 hidden md:flex h-12 w-12 rounded-full bg-indigo-50 border-4 border-white items-center justify-center shadow-sm">
                <UserCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex items-center gap-2 md:hidden mb-1">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Asignar Asesor
                </h3>
              </div>
              <div className="hidden md:block">
                <h3 className="text-lg font-semibold text-slate-900">
                  Asignar a un asesor
                </h3>
                <p className="text-sm text-slate-500">
                  Seleccione el asesor encargado de supervisar el caso
                </p>
              </div>
            </div>

            <div className="md:pl-[4.5rem] w-full">
              <div className="space-y-2 max-w-full">
                <Label
                  htmlFor="asesor"
                  className="text-slate-700 font-medium ml-1"
                >
                  Seleccionar asesor *
                </Label>
                <div className="w-full">
                  <SearchableSelector
                    items={asesoresDisponibles}
                    value={asesorId}
                    onValueChange={setAsesorId}
                    placeholder="Seleccione un asesor"
                    searchPlaceholder="Buscar por nombre o cédula..."
                    getItemValue={(a) => a.id_perfil.toString()}
                    getItemLabel={(a) => a.perfil.nombre_completo}
                    getItemSearchValue={(a) => a.perfil.cedula || ""}
                    renderItem={(asesor) => (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-2 gap-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-slate-800">
                            {asesor.perfil.nombre_completo}
                          </span>
                          <span className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="font-medium font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              CC: {asesor.perfil.cedula}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="capitalize">
                              Área: {asesor.area}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>Turno: {asesor.turno}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {(asesorSeleccionado ||
                (asesorId &&
                  asesoresDisponibles.find(
                    (a) => a.id_perfil.toString() === asesorId,
                  ))) && (
                <div className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      Detalles del Asesor
                    </h4>
                  </div>

                  {(() => {
                    const ase =
                      asesorSeleccionado ||
                      asesoresDisponibles.find(
                        (a) => a.id_perfil.toString() === asesorId,
                      );
                    if (!ase) return null;
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Nombre
                          </p>
                          <p
                            className="text-sm font-medium text-slate-700 truncate"
                            title={ase.perfil.nombre_completo}
                          >
                            {ase.perfil.nombre_completo}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Área
                          </p>
                          <div className="mt-1">
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 capitalize border-slate-200"
                            >
                              {ase.area}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Turno
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            {ase.turno}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100 my-8" />

          {/* Datos adicionales */}
          <div className="space-y-6 bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700">Fecha de creación</Label>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Estado inicial</Label>
                <div className="p-3 bg-yellow-50/80 rounded-lg border border-yellow-200/80 shadow-sm text-sm font-medium text-yellow-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  En proceso
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-slate-700">
                Observaciones (opcional)
              </Label>
              <Textarea
                id="observaciones"
                placeholder="Ingrese cualquier observación relevante para el estudiante o el asesor..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="resize-none h-24 bg-white focus-visible:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="pt-6 sm:pt-8 pb-4 flex justify-center sm:justify-end">
            <Button
              onClick={handleRegistrarCaso}
              className="w-full sm:w-auto min-w-[200px] h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-base font-medium rounded-xl"
              disabled={!estudianteId || !asesorId}
            >
              Continuar a Confirmación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
