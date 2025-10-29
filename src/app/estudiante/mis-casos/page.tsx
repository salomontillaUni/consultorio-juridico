'use client';
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Navbar } from "../components/NavBarEstudiante";
import { getStatusColor } from "app/pro-apoyo/gestionar-caso/page";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import { supabase } from "@/utils/supabase";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function CasesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [typeFilter, setTypeFilter] = useState("todos");
    const [loading, setLoading] = useState(false);
    const [casos, setCasos] = useState<Caso[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getCasos();
            setCasos(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    const filteredCases = (casos ?? []).filter(caso => {
        const nombre = caso.usuarios?.nombre_completo?.toLowerCase() || "";
        const cedula = caso.usuarios?.cedula?.toString().toLowerCase() || "";
        const area = caso.area?.toLowerCase() || "";

        // Búsqueda general
        const matchesSearch =
            nombre.includes(searchTerm.toLowerCase()) ||
            cedula.includes(searchTerm.toLowerCase()) ||
            area.includes(searchTerm.toLowerCase());

        // Estado, área 
        const matchesStatus = statusFilter === "todos" || caso.estado === statusFilter;
        const matchesArea = typeFilter === "todos" || caso.area === typeFilter;
        return matchesSearch && matchesStatus && matchesArea;
    });


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 2;
    // Paginación
    const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
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
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <Link
                                    href={'/estudiante/inicio'}
                                    className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver al inicio
                                </Link>
                                <h1 className="text-gray-900 mb-2">Mis casos</h1>
                                <p className="text-gray-600">Gestiona y supervisa todos tus casos legales</p>
                            </div>
                            <Link href={'/estudiante/entrevista'} className=" flex p-3 items-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Entrevista
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Total casos</p>
                                        {<p className="text-xl text-gray-900">{casos ? casos.length : 0}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Aprobados</p>
                                        <p className="text-xl text-gray-900">{casos ? casos.filter(c => c.estado === 'aprobado').length : 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Pendientes de aprobacion</p>
                                        <p className="text-xl text-gray-900">{casos ? casos.filter(c => c.estado === 'pendiente_aprobacion').length : 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por cliente, número de caso o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                    <SelectItem value="revision">En revisión</SelectItem>
                                    <SelectItem value="cerrado">Cerrado</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full md:w-48">
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
                    </div>

                    {/* Cases Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentCases.map((caso) => (
                            <Card key={caso.id_caso} className="p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-gray-900 mb-1"> ID caso:{caso.id_caso}</h3>
                                        <p className="text-gray-600">Usuario: {caso.usuarios?.nombre_completo}</p>
                                        <p className="text-gray-600">Documento: {caso.usuarios?.cedula}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge className={`text-xs ${getStatusColor(caso.estado)}`}>
                                            {caso.estado.charAt(0).toUpperCase() + caso.estado.slice(1)}
                                        </Badge>

                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Area:</span>
                                        <span className="text-gray-900">{caso.area}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Creado:</span>
                                        <span className="text-gray-900">{formatDate(caso.fecha_creacion)}</span>
                                    </div>
                                    {caso.fecha_cierre ? (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Archivado:</span>
                                            <span className="text-gray-900">{formatDate(caso.fecha_cierre)}</span>
                                        </div>
                                    ) : (null)}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {caso.resumen_hechos}
                                </p>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/estudiante/mis-casos/${caso.id_caso}`}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md transition-colors duration-200 text-center"
                                    >
                                        Ver detalles
                                    </Link>
                                    {
                                        caso.estado === 'en_proceso' ? (
                                            <Link
                                                href={`/estudiante/mis-casos/${caso.id_caso}/entrevista`}
                                                className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-md transition-colors duration-200 text-center"
                                            >
                                                Continuar a entrevista
                                            </Link>
                                        ) : null
                                    }


                                </div>
                            </Card>
                        ))}
                    </div>

                    {filteredCases.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-gray-900 mb-2">No se encontraron casos</h3>
                            <p className="text-gray-600 mb-4">
                                No hay casos que coincidan con los criterios de búsqueda.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("todos");
                                    setTypeFilter("todos");
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
                    {filteredCases.length > 0 && totalPages > 1 && (
                        <div className="mt-8 flex flex-col items-center gap-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            size="default"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNumber = i + 1;
                                        // Mostrar solo algunas páginas alrededor de la página actual
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
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
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}>
                                                Siguiente
                                        </PaginationNext>


                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>

                            <p className="text-sm text-gray-600">
                                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCases.length)} de {filteredCases.length} casos
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
}