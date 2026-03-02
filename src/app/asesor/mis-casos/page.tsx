"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "../components/NavBarAsesor";
import Link from "next/link";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/utils/supabase/supabase";

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendiente_aprobacion: {
      color: "bg-yellow-100 text-yellow-800",
      text: "Pendiente de aprobación",
    },
    aprobado: { color: "bg-green-100 text-green-800", text: "Aprobado" },
    en_proceso: { color: "bg-blue-100 text-blue-800", text: "En proceso" },
    cerrado: { color: "bg-gray-100 text-gray-800", text: "Cerrado" },
    archivado: { color: "bg-red-100 text-red-800", text: "Archivado" },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return <Badge className={config.color}>{config.text}</Badge>;
};

interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  area: string;
  type: string;
  status:
    | "pending_approval"
    | "approved"
    | "in_progress"
    | "completed"
    | "suspended";
  assignedStudent: string;
  assignedAdvisor: string;
  createdDate: string;
  lastUpdate: string;
  summary: string;
  requiresApproval: boolean;
}

export default function Asesor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [casos, setCasos] = useState<Caso[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          {
            data: { user },
          },
          data,
        ] = await Promise.all([supabase.auth.getUser(), getCasos()]);

        setCurrentUserId(user?.id || null);
        console.log(data);
        setCasos(data || []);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setCasos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const handleApproveCase = async (caseId: number | undefined) => {
    try {
      const { data, error } = await supabase
        .from("casos")
        .update({ estado: "aprobado" })
        .eq("id_caso", caseId);

      if (error) {
        throw error;
      }

      setCasos(
        (prevCasos) =>
          prevCasos?.map((caso) =>
            caso.id_caso === caseId ? { ...caso, estado: "aprobado" } : caso,
          ) || null,
      );

      console.log("Caso aprobado exitosamente");
    } catch (error) {
      console.error("Error aprobando caso:", error);
    }
  };

  // 1. First, filter only cases where the advisor is current active assignment
  const advisorActiveCasos = (casos ?? []).filter((caso) => {
    const activeAsesor =
      caso.asesores_casos && caso.asesores_casos.length > 0
        ? caso.asesores_casos[caso.asesores_casos.length - 1].asesor
        : null;

    return activeAsesor?.id_perfil === currentUserId;
  });

  // 2. Then apply UI filters (search, status, area)
  const filteredCases = advisorActiveCasos.filter((caso) => {
    const matchesSearch =
      caso.usuarios?.nombre_completo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false ||
      caso.usuarios?.cedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      caso.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" ||
      statusFilter === "todos" ||
      caso.estado === statusFilter;
    const matchesArea =
      areaFilter === "all" ||
      areaFilter === "todos" ||
      caso.area === areaFilter;

    return matchesSearch && matchesStatus && matchesArea;
  });

  const pendingApprovalCount = advisorActiveCasos?.filter(
    (c) => c.estado === "pendiente_aprobacion",
  ).length;
  const approvedCount = advisorActiveCasos?.filter(
    (c) => c.estado === "aprobado",
  ).length;
  const totalCount = advisorActiveCasos?.length;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredCases?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCases = filteredCases.slice(startIndex, endIndex);

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/asesor/inicio"
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
              Volver al inicio
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-gray-900 mb-2">Mis Casos Asignados</h1>
                <p className="text-gray-600">
                  Gestiona y aprueba los casos bajo tu supervisión como docente
                  asesor
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total asignados</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {totalCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">
                      Pendientes de aprobación
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {pendingApprovalCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Casos aprobados</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {approvedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Buscar
                </label>
                <Input
                  placeholder="Cliente, cédula o área..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Estado
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="pendiente_aprobacion">
                      Pendiente de Aprobación
                    </SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                    <SelectItem value="cerrado">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block font-medium">
                  Área
                </label>
                <Select
                  value={areaFilter}
                  onValueChange={setAreaFilter}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    <SelectItem value="civil">Derecho Civil</SelectItem>
                    <SelectItem value="laboral">Derecho Laboral</SelectItem>
                    <SelectItem value="familiar">Derecho Familiar</SelectItem>
                    <SelectItem value="penal">Derecho Penal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setAreaFilter("all");
                  }}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Spinner className="w-8 h-8 text-blue-600" />
              <p className="mt-4 text-slate-500 font-medium tracking-tight">
                Cargando tus casos...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentCases?.length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-900 mb-1">
                        No se encontraron casos
                      </p>
                      <p className="text-gray-600">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </Card>
                ) : (
                  currentCases?.map((caso) => (
                    <Card
                      key={caso.id_caso}
                      className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Información principal */}
                        <div className="flex-1 space-y-4">
                          {/* Encabezado */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                              Cliente:{" "}
                              <span className="font-normal">
                                {caso.usuarios?.nombre_completo || "N/A"}
                              </span>{" "}
                              | Documento:{" "}
                              <span className="font-normal">
                                {caso.usuarios?.cedula || "N/A"}
                              </span>
                            </h3>
                            <span
                              className={`px-3 py-1 mt-2 sm:mt-0 text-xs font-medium rounded-full ${
                                caso.estado === "pendiente_aprobacion"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : caso.estado === "aprobado"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {caso.estado === "pendiente_aprobacion"
                                ? "Pendiente"
                                : caso.estado === "aprobado"
                                  ? "Aprobado"
                                  : "En Proceso"}
                            </span>
                          </div>

                          {/* Detalles del caso */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <span className="text-xs uppercase text-slate-500 font-medium">
                                Área
                              </span>
                              <p className="text-sm text-slate-900">
                                {caso.area}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs uppercase text-slate-500 font-medium">
                                Tipo
                              </span>
                              <p className="text-sm text-slate-900">
                                {caso.tipo_proceso}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs uppercase text-slate-500 font-medium">
                                Estudiante
                              </span>
                              <p className="text-sm text-slate-900">
                                {caso.estudiantes_casos?.[
                                  caso.estudiantes_casos.length - 1
                                ]?.estudiante?.perfil?.nombre_completo ||
                                  "Sin asignar"}
                              </p>
                            </div>
                          </div>

                          {/* Resumen */}
                          <div>
                            <span className="text-xs uppercase text-slate-500 font-medium">
                              Resumen
                            </span>
                            <p className="text-sm text-slate-900 mt-1 leading-relaxed">
                              {caso.resumen_hechos ||
                                "No hay resumen disponible para este caso."}
                            </p>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-6">
                          <Link
                            href={`/asesor/mis-casos/${caso.id_caso}`}
                            className="w-full sm:w-auto lg:w-32 border-slate-300 hover:bg-blue-600 transition-colors bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
                          >
                            Ver detalles
                          </Link>

                          {caso.estado === "pendiente_aprobacion" && (
                            <Button
                              onClick={() => handleApproveCase(caso.id_caso)}
                              className="w-full sm:w-auto lg:w-32 bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center justify-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Aprobar
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {filteredCases.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          size="default"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        // Mostrar solo algunas páginas alrededor de la página actual
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                size="default"
                                onClick={() => setCurrentPage(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className="cursor-pointer"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <span className="px-4">...</span>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          size="default"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        >
                          Siguiente
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  <p className="text-sm text-gray-600">
                    Mostrando {startIndex + 1}-
                    {Math.min(endIndex, filteredCases.length)} de{" "}
                    {filteredCases.length} casos
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
