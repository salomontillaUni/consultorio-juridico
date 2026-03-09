"use client";
import { use, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "../../components/NavBarEstudiante";
import Link from "next/link";
import React from "react";
import { Caso, Demandado } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { AdvisorInfo } from "@/components/casos-juridicos/advisor-info";
import { supabase } from "@/utils/supabase/supabase";
import { formatDate } from "@/utils/format-date";

export default function Page({
  params,
}: {
  params: Promise<{ id_caso: string }>;
}) {
  const { id_caso } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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
    try {
      setGuardando(true);
      await supabase
        .from("casos")
        .update({ observaciones })
        .eq("id_caso", id_caso);
      setEditando(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-500 font-medium">
            Cargando detalles del caso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={"/estudiante/mis-casos"}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200 hover:underline"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a mis casos
            </Link>
            {error ? (
              <div
                className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                role="alert"
              >
                {error}
              </div>
            ) : null}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Caso #{id_caso.slice(0, 8)}
                  </h1>
                  {caso && getStatusBadge(caso.estado)}
                </div>
                <p className="text-lg text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400 font-medium">Usuario:</span>
                  <span className="font-semibold">
                    {caso?.usuarios?.nombre_completo || "N/A"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col md:items-end gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  ID del Proceso
                </span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                  {id_caso}
                </code>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="client">Usuario</TabsTrigger>
              <TabsTrigger value="defendant">Accionado</TabsTrigger>
              <TabsTrigger value="advisor">Asesor</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Case Info */}
                <div className="lg:col-span-2 space-y-6">
                  <CaseInfoTab
                    caseData={caso}
                    isEditing={false}
                    editedData={null}
                    onEdit={() => {}}
                    onSave={() => {}}
                    onCancel={() => {}}
                    onChange={() => {}}
                    getStatusBadge={getStatusBadge}
                    canEdit={false}
                  />

                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Resumen de los hechos</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {caso?.resumen_hechos || "No hay resumen de los hechos."}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Observaciones</h3>
                    </div>
                    <div className="space-y-3 ">
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
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md min-h-20">
                          {observaciones ||
                            "No hay observaciones registradas para este caso."}
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
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Fechas importantes</h3>
                    </div>
                    <div className="space-y-3">
                      {caso?.fecha_creacion && (
                        <div>
                          <Label className="text-gray-600">
                            Fecha de creación
                          </Label>
                          <p className="text-gray-900">
                            {formatDate(caso.fecha_creacion)}
                          </p>
                        </div>
                      )}
                      {caso?.fecha_cierre && (
                        <div>
                          <Label className="text-gray-600">
                            Fecha de cierre
                          </Label>
                          <p className="text-gray-900">
                            {formatDate(caso.fecha_cierre)}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-6">
              <ClientInfo
                usuarios={caso?.usuarios}
                isEditing={false}
                editedData={null}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onChange={() => {}}
                canEdit={false}
              />
            </TabsContent>

            {/* Defendant Tab */}
            <TabsContent value="defendant" className="space-y-6">
              <DefendantInfo
                defendantData={demandado}
                isEditing={false}
                editedData={null}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onChange={() => {}}
                canEdit={false}
              />
            </TabsContent>

            {/* Advisor Tab */}
            <TabsContent value="advisor" className="space-y-6">
              <AdvisorInfo
                advisors={caso?.asesores_casos?.map((ac) => ac.asesor) || []}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
