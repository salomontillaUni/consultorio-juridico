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
        const estudiantes = await getEstudiantes();
        setEstudiantesDisponibles(estudiantes);

        const asesores = await getAsesores();
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
    console.log(datosIniciales);
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
    <div className="space-y-6 md:min-w-3xl">
      {/* Información del profesional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Información del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre:</span>
              <p>{usuario.nombre_completo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Sexo:</span>
              <p>{usuario.sexo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Cedula:</span>
              <p>{usuario.cedula}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Correo:</span>
              <p>{usuario.correo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Asignación */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Asignación de Caso</CardTitle>
              <CardDescription>
                Complete la información para registrar el nuevo caso
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estudiante */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-slate-600" />
              <h3 className="text-slate-900">Asignar a un estudiante</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estudiante">Seleccionar estudiante *</Label>
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
                  <div className="flex items-center justify-between w-full py-1">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {estudiante.perfil.nombre_completo}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        CC: {estudiante.perfil.cedula} | Semestre:{" "}
                        {estudiante.semestre} | Turno: {estudiante.turno}
                      </span>
                    </div>
                    <Badge
                      variant={
                        estudiante.total_casos! >= casosMaximos
                          ? "destructive"
                          : "secondary"
                      }
                      className={cn(
                        "ml-4 text-[10px] h-5",
                        estudiante.total_casos! === 0 &&
                          "bg-green-100 text-green-700 hover:bg-green-100",
                        estudiante.total_casos! > 0 &&
                          estudiante.total_casos! < casosMaximos &&
                          "bg-blue-100 text-blue-700 hover:bg-blue-100",
                      )}
                    >
                      {estudiante.total_casos === 0
                        ? "0 casos"
                        : `${estudiante.total_casos} ${estudiante.total_casos === 1 ? "caso" : "casos"}`}
                    </Badge>
                  </div>
                )}
              />
            </div>

            {(estudianteSeleccionado ||
              (estudianteId &&
                estudiantesDisponibles.find(
                  (e) => e.id_perfil.toString() === estudianteId,
                ))) && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Nombre
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {est.perfil.nombre_completo}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Semestre
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {est.semestre}º Semestre
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Turno / Jornada
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {est.turno} ({est.jornada})
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Casos Actuales
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
                            {est.total_casos}
                          </span>
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-500",
                                est.total_casos! >= casosMaximos
                                  ? "bg-red-500"
                                  : "bg-blue-500",
                              )}
                              style={{
                                width: `${Math.min((est.total_casos! / 10) * 100, 100)}%`,
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

          {/* Asesor */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-5 w-5 text-slate-600" />
              <h3 className="text-slate-900">Asignar a un asesor</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asesor">Seleccionar asesor *</Label>
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
                  <div className="flex items-center justify-between w-full py-1">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {asesor.perfil.nombre_completo}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        CC: {asesor.perfil.cedula} | Área: {asesor.area} |
                        Turno: {asesor.turno}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            {(asesorSeleccionado ||
              (asesorId &&
                asesoresDisponibles.find(
                  (a) => a.id_perfil.toString() === asesorId,
                ))) && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Nombre
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {ase.perfil.nombre_completo}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
                          Área
                        </p>
                        <p className="text-sm font-medium text-slate-700 capitalize">
                          {ase.area}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">
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

          {/* Datos adicionales */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha de creación</Label>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado inicial</Label>
              <div className="p-3 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-800">
                En proceso
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Ingrese cualquier observación relevante..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              onClick={handleRegistrarCaso}
              className="bg-blue-600 w-sm hover:bg-blue-700 text-white transition-colors duration-200"
              size="lg"
              disabled={!estudianteId || !asesorId}
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
