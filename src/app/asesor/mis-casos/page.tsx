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
import { supabase } from "@/utils/supabase/supabase-client";
import { ArrowLeft, Check, Search, FilterX, FileText } from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-badge";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Spinner className="h-10 w-10 text-blue-600 mb-4" />
          <p className="mt-4 text-slate-500 font-medium">
            Cargando tus casos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Link
            href="/asesor/inicio"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Mis Casos Asignados
            </h1>
            <p className="text-slate-500 mt-1">
              Gestiona y aprueba los casos bajo tu supervisión como docente
              asesor.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-6 flex flex-col justify-center rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total asignados
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-6 flex flex-col justify-center rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                <svg
                  className="w-6 h-6"
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
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pendientes de aprobación
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {pendingApprovalCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-6 flex flex-col justify-center rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Casos aprobados
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {approvedCount}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 mb-8 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Usuario, cédula o área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="pl-9 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Estado
              </label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                disabled={loading}
              >
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
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

            <div className="w-full md:w-48 space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Área
              </label>
              <Select
                value={areaFilter}
                onValueChange={setAreaFilter}
                disabled={loading}
              >
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
                  <SelectValue placeholder="Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  <SelectItem value="civil">Derecho Civil</SelectItem>
                  <SelectItem value="laboral">Derecho Laboral</SelectItem>
                  <SelectItem value="familia">Derecho Familiar</SelectItem>
                  <SelectItem value="penal">Derecho Penal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setAreaFilter("all");
              }}
              variant="outline"
              className="w-full md:w-auto shrink-0 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
              disabled={loading}
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </Card>

        {/* Case List Grid */}
        {currentCases?.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none rounded-2xl mt-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No se encontraron casos
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Intenta ajustar los filtros de búsqueda para encontrar lo que
              necesitas.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setAreaFilter("all");
              }}
              className="bg-white"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {currentCases?.map((caso) => (
              <Card
                key={caso.id_caso}
                className="p-6 border-none shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-blue-900/5 transition-all duration-300 bg-white rounded-2xl group flex flex-col"
              >
                <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400">
                      Caso #{caso.id_caso}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {caso.usuarios?.nombre_completo || "Cliente Sin Nombre"}
                    </h3>
                    <div className="text-sm font-medium text-slate-500">
                      {caso.usuarios?.cedula
                        ? `C.C. ${caso.usuarios.cedula}`
                        : "Sin Documento"}
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(caso.estado)}</div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Área
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {caso.area}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Estudiante
                      </span>
                      {caso.estudiantes_casos?.length ? (
                        <p className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-full">
                          {caso.estudiantes_casos[
                            caso.estudiantes_casos.length - 1
                          ]?.estudiante?.perfil?.nombre_completo ||
                            "Sin asignar"}
                        </p>
                      ) : (
                        <p className="text-sm italic text-slate-400">
                          Sin asignar
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Tipo
                      </span>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {caso.tipo_proceso || "Sin especificar"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Resumen
                    </span>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {caso.resumen_hechos ?? (
                        <span className="italic opacity-70">
                          No hay resumen redactado.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-3">
                  <Link
                    href={`/asesor/mis-casos/${caso.id_caso}`}
                    className="flex w-full items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 text-sm shadow-xs"
                  >
                    Ver expediente completo
                  </Link>
                  {caso.estado === "pendiente_aprobacion" && (
                    <Button
                      onClick={() => handleApproveCase(caso.id_caso)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 h-[42px] rounded-xl font-medium"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprobar Caso
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredCases.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <Pagination>
              <PaginationContent className="bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50 text-slate-400"
                        : "cursor-pointer text-slate-700"
                    }
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className={`cursor-pointer rounded-full ${currentPage === pageNumber ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-700 hover:bg-slate-100"}`}
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
                        <span className="px-4 text-slate-400">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50 text-slate-400"
                        : "cursor-pointer text-slate-700"
                    }
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Mostrando {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredCases.length)} de{" "}
              {filteredCases.length} casos
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
