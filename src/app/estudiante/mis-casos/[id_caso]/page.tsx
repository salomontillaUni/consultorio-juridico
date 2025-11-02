"use client";
import { use, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "../../components/NavBarEstudiante";
import Link from "next/link";
import React from "react";
import { Caso, Demandado } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { formatDate, getStatusColor } from "app/pro-apoyo/gestionar-caso/page";
import { CassetteTapeIcon } from "lucide-react";
import { supabase } from "@/utils/supabase";


export default function Page({ params }: { params: Promise<{ id_caso: string }> }) {
  const { id_caso } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [observaciones, setObservaciones] = useState("");

  async function traerDatos() {
    try {
      setError(null);

      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(id_caso),
        getDemandadoByCasoId(id_caso),
      ]);

      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);
      console.log(casoFetch);
      setDemandado(demandadoFetch);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
    }
  }

  useEffect(() => {
    traerDatos();
  }, []);

  useEffect(() => {
    if (caso) {
      setObservaciones(caso.observaciones || "");
    }
  }, [caso]);

  const handleGuardar = async () => {
    try{
      setGuardando(true);
      await supabase.from('casos').update({ observaciones }).eq('id_caso', id_caso);
      setEditando(false);
    }catch (err){
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={'/estudiante/mis-casos'}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200 hover:underline"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a mis casos
            </Link>
            {
              error ? (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                  {error}
                </div>) : null
            }
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-gray-900 mb-2">{id_caso}</h1>
                <p className="text-gray-600">{caso?.usuarios.nombre_completo}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {caso && (
                  <Badge className={`text-sm ${getStatusColor(caso?.estado)} justify-center sm:justify-start`}>
                    {caso?.estado}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="client">Cliente</TabsTrigger>
              <TabsTrigger value="defendant">Demandado</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Case Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Información del caso</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-600">Tipo de caso</Label>
                        <p className="text-gray-900 mb-4">{caso?.area}</p>

                        <Label className="text-gray-600">Estado de aprobación</Label>
                        <div className="mb-4">
                          <Badge className={`${caso?.aprobacion_asesor ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                            {caso?.estado}
                          </Badge>
                        </div>

                        <Label className="text-gray-600">Tipo de proceso</Label>
                        <p className="text-gray-900">{caso?.tipo_proceso}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Estudiante asignado</Label>
                        <p className="text-gray-900 mb-4">{caso?.estudiantes_casos.map((estudiante) => estudiante.estudiante.perfil.nombre_completo).join(", ")}</p>

                        <Label className="text-gray-600">Asesor asignado</Label>
                        <p className="text-gray-900">{caso?.asesores_casos.map((asesor) => asesor.asesor.perfil.nombre_completo).join(", ")}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Resumen de los hechos</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{caso?.resumen_hechos}</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Observaciones</h3>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Observaciones</h3>
                        {!editando ? (
                          <Button
                            onClick={() => setEditando(true)}
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Editar
                          </Button>
                        ) : (
                          <div className="space-x-2">
                            <Button
                              onClick={handleGuardar}
                              disabled={guardando}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {guardando ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button
                              onClick={() => {
                                setEditando(false);
                                setObservaciones(caso?.observaciones || ""); // restaurar valor original
                              }}
                              variant="outline"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>

                      {!editando ? (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md min-h-[80px]">
                          {observaciones || "No hay observaciones registradas para este caso."}
                        </p>
                      ) : (
                        <Textarea
                          value={observaciones}
                          onChange={(e) => setObservaciones(e.target.value)}
                          className="min-h-28"
                        />
                      )}
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Fechas importantes</h3>
                    </div>
                    <div className="space-y-3">
                      {
                        caso?.fecha_creacion && (
                          <div>
                            <Label className="text-gray-600">Fecha de creación</Label>
                            <p className="text-gray-900">{formatDate(caso.fecha_creacion)}</p>
                          </div>
                        )}
                      {caso?.fecha_cierre && (
                        <div>
                          <Label className="text-gray-600">Fecha de cierre</Label>
                          <p className="text-gray-900">{formatDate(caso.fecha_cierre)}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-6">
              {/* Personal Information */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información personal</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-600">Nombre completo</Label>
                    <p className="text-gray-900">{caso?.usuarios.nombre_completo}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Sexo</Label>
                    <p className="text-gray-900">{caso?.usuarios.sexo}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Cédula</Label>
                    <p className="text-gray-900">{caso?.usuarios.cedula}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Edad</Label>
                    <p className="text-gray-900">{caso?.usuarios.edad} años</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Estado civil</Label>
                    <p className="text-gray-900">{caso?.usuarios.estado_civil}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Estrato</Label>
                    <p className="text-gray-900">{caso?.usuarios.estrato}</p>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información de contacto</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-600">Teléfono</Label>
                    <p className="text-gray-900 mb-4">{caso?.usuarios.telefono}</p>

                    <Label className="text-gray-600">Correo electrónico</Label>
                    <p className="text-gray-900 mb-4">{caso?.usuarios.correo}</p>

                    <Label className="text-gray-600">Dirección</Label>
                    <p className="text-gray-900">{caso?.usuarios.direccion}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Contacto de familiar</Label>
                    <p className="text-gray-900 mb-4">{caso?.usuarios.contacto_familiar}</p>

                    <Label className="text-gray-600">Tipo de vivienda</Label>
                    <p className="text-gray-900 mb-4">{caso?.usuarios.tipo_vivienda}</p>


                  </div>
                </div>
              </Card>

              {/* Financial Information */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información laboral y financiera</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-600">Situación laboral</Label>
                    <p className="text-gray-900 mb-4">{caso?.usuarios.situacion_laboral}</p>

                    <Label className="text-gray-600">Otros ingresos</Label>
                    {caso?.usuarios.otros_ingresos ? (
                      <p className="text-gray-900 mb-4">Sí</p>
                    ) : (
                      <p className="text-gray-900 mb-4">No</p>
                    )}
                  </div>

                  {caso?.usuarios.otros_ingresos && (
                    <div>
                      <Label className="text-gray-600">Valor de otros ingresos</Label>
                      <p className="text-gray-900 mb-4">{caso?.usuarios.valor_otros_ingresos}</p>

                      <Label className="text-gray-600">Concepto de otros ingresos</Label>
                      <p className="text-gray-900">{caso?.usuarios.concepto_otros_ingresos}</p>
                    </div>
                  )}

                </div>
              </Card>


            </TabsContent>

            {/* Defendant Tab */}
            <TabsContent value="defendant" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información del demandado</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-600">Nombre completo</Label>
                    <p className="text-gray-900 mb-4">{demandado?.nombre_completo}</p>

                    <Label className="text-gray-600">Documento</Label>
                    <p className="text-gray-900 mb-4">{demandado?.documento}</p>

                    <Label className="text-gray-600">Celular</Label>
                    <p className="text-gray-900">{demandado?.celular}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Lugar de residencia</Label>
                    <p className="text-gray-900 mb-4">{demandado?.lugar_residencia}</p>

                    <Label className="text-gray-600">Correo electrónico</Label>
                    <p className="text-gray-900 mb-4">{demandado?.correo}</p>
                  </div>
                </div>
              </Card>

            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>

  );
}