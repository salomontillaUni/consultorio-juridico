"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Navbar } from "../components/NavBarProApoyo";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getStatusBadge } from "@/components/ui/status-badge";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Check,
  Search,
  FilterX,
  FileText,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/format-date";

export default function SupportCasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [studentFilter, setStudentFilter] = useState("todos");
  const [casos, setCasos] = useState<Caso[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getCasos();
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

  const filteredCases = (casos ?? []).filter((caso) => {
    const nombre = caso.usuarios?.nombre_completo?.toLowerCase() || "";
    const cedula = caso.usuarios?.cedula?.toString().toLowerCase() || "";
    const resumenHechos = caso.resumen_hechos?.toLowerCase() || "";
    const area = caso.area?.toLowerCase() || "";

    // Búsqueda general
    const matchesSearch =
      nombre.includes(searchTerm.toLowerCase()) ||
      cedula.includes(searchTerm.toLowerCase()) ||
      resumenHechos.includes(searchTerm.toLowerCase()) ||
      area.includes(searchTerm.toLowerCase());

    // Estado, área y estudiante
    const matchesStatus =
      statusFilter === "todos" || caso.estado === statusFilter;
    const matchesArea = typeFilter === "todos" || caso.area === typeFilter;
    const matchesStudent =
      studentFilter === "todos" ||
      caso.estudiantes_casos?.some(
        (ec) => ec.estudiante.perfil.nombre_completo === studentFilter,
      );

    return matchesSearch && matchesStatus && matchesArea && matchesStudent;
  });

  const uniqueStudents = [
    ...new Set(
      (casos ?? []).flatMap(
        (c) =>
          c.estudiantes_casos
            ?.map((ec) => ec.estudiante?.perfil?.nombre_completo)
            .filter(Boolean) || [],
      ),
    ),
  ];

  // Paginación
  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
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
            Cargando supervisión de casos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 space-y-4">
          <Link
            href="/pro-apoyo/inicio"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Supervisión de Casos
            </h1>
            <p className="text-slate-500 mt-1">
              Supervisa y apoya el trabajo de los estudiantes en todos los casos
              legales del consultorio.
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
                  Total casos
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {casos?.length || 0}
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
                <p className="text-sm font-medium text-slate-500">Aprobados</p>
                <p className="text-2xl font-bold text-slate-900">
                  {casos?.filter((c) => c.estado === "aprobado").length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-6 flex flex-col justify-center rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Estudiantes activos
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {uniqueStudents.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 mb-8 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Buscar general
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Cliente, documento, descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-colors rounded-xl"
                />
              </div>
            </div>

            <div className="w-full lg:w-48 space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Estado
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="pendiente_aprobacion">
                    Pendiente
                  </SelectItem>
                  <SelectItem value="archivado">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48 space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tipo
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
                  <SelectValue placeholder="Tipo de caso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="civil">Derecho Civil</SelectItem>
                  <SelectItem value="laboral">Derecho Laboral</SelectItem>
                  <SelectItem value="familiar">Derecho Familiar</SelectItem>
                  <SelectItem value="penal">Derecho Penal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("todos");
                setTypeFilter("todos");
                setStudentFilter("todos");
              }}
              variant="outline"
              className="w-full md:w-auto shrink-0 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </Card>

        {/* Case List Grid */}
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
                    {caso.usuarios.nombre_completo}
                  </h3>
                  <div className="text-sm font-medium text-slate-500">
                    {caso.usuarios.cedula}
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
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Estudiante
                    </span>
                    {caso.estudiantes_casos?.length ? (
                      <p className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-full">
                        {
                          caso.estudiantes_casos[
                            caso.estudiantes_casos.length - 1
                          ].estudiante.perfil.nombre_completo
                        }
                      </p>
                    ) : (
                      <p className="text-sm italic text-slate-400">
                        Sin asignar
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Asesor
                    </span>
                    {caso.asesores_casos?.length ? (
                      <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-full">
                        {
                          caso.asesores_casos[caso.asesores_casos.length - 1]
                            .asesor.perfil.nombre_completo
                        }
                      </p>
                    ) : (
                      <p className="text-sm italic text-slate-400">
                        Sin asignar
                      </p>
                    )}
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

              <div className="mt-auto pt-4 border-t border-slate-50">
                <Link
                  className="flex w-full items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 text-sm shadow-xs"
                  href={`/pro-apoyo/gestionar-caso/${caso.id_caso}`}
                >
                  Modificar & Supervisar
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredCases?.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none rounded-2xl mt-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No se encontraron casos
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
              No hay casos que coincidan con los criterios de búsqueda actuales.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("todos");
                setTypeFilter("todos");
                setStudentFilter("todos");
              }}
              className="bg-white"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </Card>
        )}

        {/* Pagination Block */}
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
