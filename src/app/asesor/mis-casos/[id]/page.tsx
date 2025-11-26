'use client';
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Navbar } from "app/asesor/components/NavBarAsesor";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { Asesor, Caso, Demandado, Estudiante } from "app/types/database";


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [approvalNotes, setApprovalNotes] = useState("");
  const [caseStatus, setCaseStatus] = useState("pending_approval");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demandado, setDemandado] = useState<Demandado>();
  const [caso, setCaso] = useState<Caso>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [ultimoEstudiante, setUltimoEstudiante] = useState<Estudiante>();
  const [ultimoAsesor, setUltimoAsesor] = useState<Asesor>();
  const id_caso = id;


  async function traerDatos() {
    try {
      setError('');
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
      setUltimoEstudiante(casoFetch.estudiantes_casos[casoFetch.estudiantes_casos.length - 1].estudiante);
      setUltimoAsesor(casoFetch.asesores_casos[casoFetch.asesores_casos.length - 1].asesor);
      console.log(casoFetch);
      if (!demandadoFetch) {
        console.log("Demandado no encontrado");
        return;
      }
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendiente_aprobacion: { color: "bg-yellow-100 text-yellow-800", text: "Pendiente de aprobación" },
      aprobado: { color: "bg-green-100 text-green-800", text: "Aprobado" },
      en_progreso: { color: "bg-blue-100 text-blue-800", text: "En progreso" },
      cerrado: { color: "bg-gray-100 text-gray-800", text: "Cerrado" },
      archivado: { color: "bg-red-100 text-red-800", text: "Archivado" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  if (!caso) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 mt-5">Caso no encontrado</p>
      </div>
    );
  }
  if (!demandado) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 mt-5">Demandado no encontrado</p>
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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a mis casos
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-gray-900">{caso.id_caso}</h1>
                  {getStatusBadge(caso.estado)}
                </div>
                <p className="text-gray-600">Cliente: {caso.usuarios.nombre_completo}</p>
                <p className="text-gray-600">Cedula: {caso.usuarios.cedula}</p>
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
                  <span className="text-sm text-gray-600">Resumen de los hechos:</span>
                  <p className="text-gray-900 mt-2">{caso.resumen_hechos}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Observaciones:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">{caso.observaciones}</pre>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Observaciones:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">{caso.observaciones}</pre>
                  </div>
                </div>
              </Card>

              {/* Información del Cliente */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Información del Cliente</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Nombre completo:</span>
                    <p className="text-gray-900">{caso.usuarios.nombre_completo}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Documento:</span>
                    <p className="text-gray-900">{caso.usuarios.cedula}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Teléfono:</span>
                    <p className="text-gray-900">{caso.usuarios.telefono}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Correo:</span>
                    <p className="text-gray-900">{caso.usuarios.correo}</p>
                  </div>
                </div>
              </Card>

              {/* Información del Demandado */}
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Información del Demandado</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Nombre/Razón social:</span>
                    <p className="text-gray-900">{demandado.nombre_completo}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">NIT/Documento:</span>
                    <p className="text-gray-900">{demandado.documento}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Teléfono:</span>
                    <p className="text-gray-900">{demandado.celular}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Correo:</span>
                    <p className="text-gray-900">{demandado.correo}</p>
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
                    <span className="text-sm text-gray-600">Estudiante asignado:</span>
                    <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-900">{ultimoEstudiante?.perfil.nombre_completo}</p>
                      <p className="text-blue-700 text-sm">{ultimoEstudiante?.perfil.correo}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs text-blue-700">
                          Semestre: {ultimoEstudiante?.semestre}
                        </Badge>
                      </div>
                      
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Asesor asignado:</span>
                    <div className="mt-1 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-900">{ultimoAsesor?.perfil.nombre_completo}</p>
                      <p className="text-green-700 text-sm">{ultimoAsesor?.perfil.correo}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs text-green-700">
                            Area: {ultimoAsesor?.area}
                          </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>


              {/* Estado del caso (si ya está aprobado) */}
              {caso.estado !== "pendiente_aprobacion" && (
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-4">Estado del Caso</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                      <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-green-900">Caso Aprobado</p>
                        <p className="text-green-700 text-sm">En seguimiento activo</p>
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