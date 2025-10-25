'use client';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Nav } from "react-day-picker";
import { Navbar } from "../components/NavBarEstudiante";

interface Case {
    id: string;
    caseNumber: string;
    clientName: string;
    caseType: string;
    status: "activo" | "pendiente" | "cerrado" | "revision";
    dateCreated: string;
    lastUpdate: string;
    nextHearing: string | null;
    description: string;
}

const mockCases: Case[] = [
    {
        id: "1",
        caseNumber: "CASO-2024-001",
        clientName: "María González",
        caseType: "Derecho Civil",
        status: "activo",
        dateCreated: "2024-01-15",
        lastUpdate: "2024-10-01",
        nextHearing: "2024-10-15",
        description: "Demanda por incumplimiento de contrato de servicios profesionales"
    },
    {
        id: "2",
        caseNumber: "CASO-2024-002",
        clientName: "Carlos Rodríguez",
        caseType: "Derecho Laboral",
        status: "pendiente",
        dateCreated: "2024-02-03",
        lastUpdate: "2024-09-28",
        nextHearing: null,
        description: "Despido improcedente y reclamación de indemnización"
    },
    {
        id: "3",
        caseNumber: "CASO-2024-003",
        clientName: "Ana Martínez",
        caseType: "Derecho Familiar",
        status: "revision",
        dateCreated: "2024-03-10",
        lastUpdate: "2024-10-02",
        nextHearing: "2024-10-20",
        description: "Proceso de divorcio y custodia de menores"
    },
    {
        id: "4",
        caseNumber: "CASO-2024-004",
        clientName: "Luis Fernández",
        caseType: "Derecho Penal",
        status: "activo",
        dateCreated: "2024-04-22",
        lastUpdate: "2024-10-03",
        nextHearing: "2024-10-12",
        description: "Defensa en proceso por delito contra la salud pública"
    },
    {
        id: "5",
        caseNumber: "CASO-2024-005",
        clientName: "Carmen López",
        caseType: "Derecho Mercantil",
        status: "cerrado",
        dateCreated: "2024-01-08",
        lastUpdate: "2024-08-15",
        nextHearing: null,
        description: "Constitución de sociedad mercantil y redacción de estatutos"
    },
    {
        id: "6",
        caseNumber: "CASO-2024-006",
        clientName: "Roberto Silva",
        caseType: "Derecho Civil",
        status: "activo",
        dateCreated: "2024-05-14",
        lastUpdate: "2024-09-30",
        nextHearing: "2024-10-18",
        description: "Reclamación de deudas y ejecución hipotecaria"
    }
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "activo": return "bg-green-100 text-green-800 border-green-200";
        case "pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "cerrado": return "bg-gray-100 text-gray-800 border-gray-200";
        case "revision": return "bg-blue-100 text-blue-800 border-blue-200";
        default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "alta": return "bg-red-100 text-red-800 border-red-200";
        case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "baja": return "bg-green-100 text-green-800 border-green-200";
        default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

interface CasesPageProps {
    onBack: () => void;
    onViewCase: (caseId: string) => void;
}

export default function CasesPage({ onBack, onViewCase }: CasesPageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [typeFilter, setTypeFilter] = useState("todos");

    const filteredCases = mockCases.filter(caso => {
        const matchesSearch =
            caso.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caso.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caso.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "todos" || caso.status === statusFilter;
        const matchesType = typeFilter === "todos" || caso.caseType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nuevo caso
                            </Button>
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
                                        <p className="text-xl text-gray-900">{mockCases.length}</p>
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
                                        <p className="text-sm text-gray-600">Activos</p>
                                        <p className="text-xl text-gray-900">{mockCases.filter(c => c.status === 'activo').length}</p>
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
                                        <p className="text-sm text-gray-600">Pendientes</p>
                                        <p className="text-xl text-gray-900">{mockCases.filter(c => c.status === 'pendiente').length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
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
                                    <SelectItem value="Derecho Civil">Derecho Civil</SelectItem>
                                    <SelectItem value="Derecho Laboral">Derecho Laboral</SelectItem>
                                    <SelectItem value="Derecho Familiar">Derecho Familiar</SelectItem>
                                    <SelectItem value="Derecho Penal">Derecho Penal</SelectItem>
                                    <SelectItem value="Derecho Mercantil">Derecho Mercantil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Cases Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredCases.map((caso) => (
                            <Card key={caso.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-gray-900 mb-1">{caso.caseNumber}</h3>
                                        <p className="text-gray-600">{caso.clientName}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge className={`text-xs ${getStatusColor(caso.status)}`}>
                                            {caso.status.charAt(0).toUpperCase() + caso.status.slice(1)}
                                        </Badge>

                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tipo:</span>
                                        <span className="text-gray-900">{caso.caseType}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Creado:</span>
                                        <span className="text-gray-900">{formatDate(caso.dateCreated)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Última actualización:</span>
                                        <span className="text-gray-900">{formatDate(caso.lastUpdate)}</span>
                                    </div>
                                    {caso.nextHearing && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Próxima audiencia:</span>
                                            <span className="text-blue-600">{formatDate(caso.nextHearing)}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {caso.description}
                                </p>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/estudiante/mis-casos/${caso.id}`}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md transition-colors duration-200 text-center"
                                    >
                                        Ver detalles
                                    </Link>

                                    <Button variant="outline" size="sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </Button>
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
                </div>
            </main>
        </div>

    );
}