'use client';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "../components/NavBarAsesor";
import Link from "next/link";

interface Case {
    id: string;
    caseNumber: string;
    clientName: string;
    area: string;
    type: string;
    status: "pending_approval" | "approved" | "in_progress" | "completed" | "suspended";
    assignedStudent: string;
    assignedAdvisor: string;
    createdDate: string;
    lastUpdate: string;
    summary: string;
    requiresApproval: boolean;
}

interface AdvisorCasesPageProps {
    onBack: () => void;
    onViewCase: (caseId: string) => void;
}

export default function AdvisorCasesPage({ onBack, onViewCase }: AdvisorCasesPageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [areaFilter, setAreaFilter] = useState("all");

    // Mock data - En producción vendría de la API
    const mockCases: Case[] = [
        {
            id: "1",
            caseNumber: "CJ-2024-001",
            clientName: "María González",
            area: "Laboral",
            type: "Despido injustificado",
            status: "pending_approval",
            assignedStudent: "Andrea Vargas",
            assignedAdvisor: "Dr. Roberto Silva",
            createdDate: "2024-01-15",
            lastUpdate: "2024-01-16",
            summary: "Caso de despido sin justa causa. Cliente requiere asesoría para reclamación de indemnización.",
            requiresApproval: true
        },
        {
            id: "2",
            caseNumber: "CJ-2024-002",
            clientName: "Carlos Herrera",
            area: "Laboral",
            type: "Acoso laboral",
            status: "approved",
            assignedStudent: "Andrea Vargas",
            assignedAdvisor: "Dr. Roberto Silva",
            createdDate: "2024-01-10",
            lastUpdate: "2024-01-14",
            summary: "Situación de acoso laboral documentada. Seguimiento de proceso disciplinario interno.",
            requiresApproval: false
        },
        {
            id: "3",
            caseNumber: "CJ-2024-003",
            clientName: "Ana Jiménez",
            area: "Laboral",
            type: "Liquidación laboral",
            status: "in_progress",
            assignedStudent: "Andrea Vargas",
            assignedAdvisor: "Dr. Roberto Silva",
            createdDate: "2024-01-08",
            lastUpdate: "2024-01-12",
            summary: "Revisión de liquidación final. Verificación de prestaciones sociales.",
            requiresApproval: false
        },
        {
            id: "4",
            caseNumber: "CJ-2024-004",
            clientName: "Pedro Martínez",
            area: "Laboral",
            type: "Incapacidad laboral",
            status: "pending_approval",
            assignedStudent: "Miguel Torres",
            assignedAdvisor: "Dr. Roberto Silva",
            createdDate: "2024-01-14",
            lastUpdate: "2024-01-15",
            summary: "Proceso de incapacidad laboral. Cliente requiere representación ante EPS.",
            requiresApproval: true
        }
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending_approval: { color: "bg-yellow-100 text-yellow-800", text: "Pendiente de aprobación" },
            approved: { color: "bg-green-100 text-green-800", text: "Aprobado" },
            in_progress: { color: "bg-blue-100 text-blue-800", text: "En progreso" },
            completed: { color: "bg-gray-100 text-gray-800", text: "Completado" },
            suspended: { color: "bg-red-100 text-red-800", text: "Suspendido" }
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    const handleApproveCase = async (caseId: string) => {
        try {
            // Aquí iría la llamada a la API para aprobar el caso
            console.log('Aprobando caso:', caseId);
            alert('Caso aprobado exitosamente');
            // En una implementación real, actualizaríamos el estado o recargaríamos los datos
        } catch (error) {
            console.error('Error aprobando caso:', error);
            alert('Error al aprobar el caso');
        }
    };

    const filteredCases = mockCases.filter(caso => {
        const matchesSearch = caso.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caso.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caso.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || caso.status === statusFilter;
        const matchesArea = areaFilter === "all" || caso.area === areaFilter;

        return matchesSearch && matchesStatus && matchesArea;
    });

    const pendingApprovalCount = mockCases.filter(c => c.status === "pending_approval").length;
    const approvedCount = mockCases.filter(c => c.status === "approved" || c.status === "in_progress").length;

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
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver al inicio
                        </Link>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-gray-900 mb-2">Mis Casos Asignados</h1>
                                <p className="text-gray-600">
                                    Gestiona y aprueba los casos bajo tu supervisión como docente asesor
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 sm:mt-0 flex space-x-4">
                                <div className="text-center">
                                    <div className="bg-yellow-100 text-yellow-800 rounded-lg p-3">
                                        <div className="text-2xl">{pendingApprovalCount}</div>
                                        <div className="text-sm">Pendientes</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-100 text-green-800 rounded-lg p-3">
                                        <div className="text-2xl">{approvedCount}</div>
                                        <div className="text-sm">Activos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="p-6 mb-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Buscar</label>
                                <Input
                                    placeholder="Cliente, número o tipo de caso..."
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Estado</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="pending_approval">Pendiente de aprobación</SelectItem>
                                        <SelectItem value="approved">Aprobado</SelectItem>
                                        <SelectItem value="in_progress">En progreso</SelectItem>
                                        <SelectItem value="completed">Completado</SelectItem>
                                        <SelectItem value="suspended">Suspendido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Área</label>
                                <Select value={areaFilter} onValueChange={setAreaFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las áreas</SelectItem>
                                        <SelectItem value="Laboral">Laboral</SelectItem>
                                        <SelectItem value="Civil">Civil</SelectItem>
                                        <SelectItem value="Familia">Familia</SelectItem>
                                        <SelectItem value="Penal">Penal</SelectItem>
                                        <SelectItem value="Comercial">Comercial</SelectItem>
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
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Cases List */}
                    <div className="space-y-4">
                        {filteredCases.length === 0 ? (
                            <Card className="p-8 text-center">
                                <div className="text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-900 mb-1">No se encontraron casos</p>
                                    <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            </Card>
                        ) : (
                            filteredCases.map((caso) => (
                                <Card
                                    key={caso.id}
                                    className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                                        {/* Información principal */}
                                        <div className="flex-1 space-y-4">
                                            {/* Encabezado */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    Cliente: {caso.clientName}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 mt-2 sm:mt-0 text-xs font-medium rounded-full ${caso.status === "pending_approval"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : caso.status === "approved"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {caso.status === "pending_approval"
                                                        ? "Pendiente"
                                                        : caso.status === "approved"
                                                            ? "Aprobado"
                                                            : "En revisión"}
                                                </span>
                                            </div>

                                            {/* Detalles del caso */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <span className="text-xs uppercase text-slate-500 font-medium">
                                                        Área
                                                    </span>
                                                    <p className="text-sm text-slate-900">{caso.area}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase text-slate-500 font-medium">
                                                        Tipo
                                                    </span>
                                                    <p className="text-sm text-slate-900">{caso.type}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase text-slate-500 font-medium">
                                                        Estudiante
                                                    </span>
                                                    <p className="text-sm text-slate-900">{caso.assignedStudent}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase text-slate-500 font-medium">
                                                        Última actualización
                                                    </span>
                                                    <p className="text-sm text-slate-900">
                                                        {new Date(caso.lastUpdate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Resumen */}
                                            <div>
                                                <span className="text-xs uppercase text-slate-500 font-medium">
                                                    Resumen
                                                </span>
                                                <p className="text-sm text-slate-900 mt-1 leading-relaxed">
                                                    {caso.summary}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-6">
                                            <Link
                                                href={`/asesor/mis-casos/${caso.id}`}
                                                className="w-full sm:w-auto lg:w-32 border-slate-300 hover:bg-blue-600 transition-colors bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                            >
                                                Ver detalles
                                            </Link>

                                            {caso.status === "pending_approval" && (
                                                <Button
                                                    onClick={() => handleApproveCase(caso.id)}
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

                    {/* Summary */}
                    {filteredCases.length > 0 && (
                        <div className="mt-8 text-center text-gray-600">
                            <p>Mostrando {filteredCases.length} de {mockCases.length} casos asignados</p>
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
}