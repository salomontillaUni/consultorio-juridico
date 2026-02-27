"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Navbar } from "app/asesor/components/NavBarAsesor";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { Asesor, Caso, Demandado, Estudiante } from "app/types/database";
import { Textarea } from "@/components/ui/textarea";
import { updateObservaciones } from "../../../../../supabase/queries/updateObservaciones";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";
import { getStatusBadge } from "../page";


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [demandado, setDemandado] = useState<Demandado>();
  const [caso, setCaso] = useState<Caso>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ultimoEstudiante, setUltimoEstudiante] = useState<Estudiante>();
  const [ultimoAsesor, setUltimoAsesor] = useState<Asesor>();
  const id_caso = id;

  const [isEditing, setIsEditing] = useState(false);
  const [editObservaciones, setEditObservaciones] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function traerDatos() {
    try {
      setError("");
      setLoading(true);
      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(id_caso),
        getDemandadoByCasoId(id_caso),
      ]);

      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);

      const lastEstudiante =
        casoFetch.estudiantes_casos?.[casoFetch.estudiantes_casos.length - 1]
          ?.estudiante;
      if (lastEstudiante) setUltimoEstudiante(lastEstudiante);

      const lastAsesor =
        casoFetch.asesores_casos?.[casoFetch.asesores_casos.length - 1]?.asesor;
      if (lastAsesor) setUltimoAsesor(lastAsesor);

      if (demandadoFetch) {
        setDemandado(demandadoFetch);
      }
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateObservaciones = async () => {
    try {
      setIsSaving(true);
      await updateObservaciones(id_caso, editObservaciones);
      setCaso((prev) =>
        prev ? { ...prev, observaciones: editObservaciones } : prev,
      );
      setIsEditing(false);
      toast.success("Observaciones actualizadas correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar las observaciones");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setEditObservaciones(caso?.observaciones || "");
    setIsEditing(true);
  };

  useEffect(() => {
    traerDatos();
  }, []);

  

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium">
          Cargando detalles del caso...
        </p>
      </div>
    );
  }
  if (!caso) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-gray-600 font-medium">
          El caso no pudo ser encontrado.
        </p>
        <Link href="/asesor/mis-casos">
          <Button variant="outline">Volver a mis casos</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/asesor/mis-casos"
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors cursor-pointer hover:underline"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a mis casos
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-gray-900">{caso.id_caso}</h1>
                  {getStatusBadge(caso.estado)}
                </div>
                <p className="text-gray-600">
                  Cliente: {caso.usuarios?.nombre_completo || "N/A"}
                </p>
                <p className="text-gray-600">
                  Cedula: {caso.usuarios?.cedula || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información del Caso */}
              <Card className="p-6">
                <h2 className="text-gray-900 mb-4">Información del Caso</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm text-gray-600">Área:</span>
                    <p className="text-gray-900">{caso.area}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tipo de caso:</span>
                    <p className="text-gray-900">{caso.tipo_proceso}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-600">
                    Resumen de los hechos:
                  </span>
                  <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      {caso.resumen_hechos ||
                        "No hay resumen de los hechos registrado."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Observaciones:
                    </span>
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startEditing}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Agregar Observacion
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editObservaciones}
                        onChange={(e) => setEditObservaciones(e.target.value)}
                        placeholder="Ingrese las observaciones aquí..."
                        className="min-h-[150px] bg-white"
                        disabled={isSaving}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdateObservaciones}
                          disabled={isSaving}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Guardar cambios
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {caso.observaciones ||
                          "No hay observaciones registradas."}
                      </pre>
                    </div>
                  )}
                </div>
              </Card>

              {/* Información del Cliente */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Información del Cliente</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      Nombre completo:
                    </span>
                    <p className="text-gray-900">
                      {caso.usuarios?.nombre_completo || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Documento:</span>
                    <p className="text-gray-900">
                      {caso.usuarios?.cedula || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Teléfono:</span>
                    <p className="text-gray-900">
                      {caso.usuarios?.telefono || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Correo:</span>
                    <p className="text-gray-900">
                      {caso.usuarios?.correo || "N/A"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Información del Demandado */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">
                  Información del Demandado
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      Nombre/Razón social:
                    </span>
                    <p className="text-gray-900">
                      {demandado?.nombre_completo || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      NIT/Documento:
                    </span>
                    <p className="text-gray-900">
                      {demandado?.documento || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Teléfono:</span>
                    <p className="text-gray-900">
                      {demandado?.celular || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Correo:</span>
                    <p className="text-gray-900">
                      {demandado?.correo || "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Asignaciones */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Asignaciones</h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      Estudiante asignado:
                    </span>
                    <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-900">
                        {ultimoEstudiante?.perfil?.nombre_completo || "N/A"}
                      </p>
                      <p className="text-blue-700 text-sm">
                        {ultimoEstudiante?.perfil?.correo || "N/A"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs text-blue-700"
                        >
                          Semestre: {ultimoEstudiante?.semestre}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Estado del caso (si ya está aprobado) */}
              {caso.estado === "aprobado" && (
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-4">Estado del Caso</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                      <svg
                        className="w-8 h-8 text-green-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-green-900">Caso Aprobado</p>
                        <p className="text-green-700 text-sm">
                          En seguimiento activo
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
