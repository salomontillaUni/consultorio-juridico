import { ReactEventHandler, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  caseType: string;
  status: "activo" | "pendiente" | "cerrado" | "revision";
  priority: "alta" | "media" | "baja";
  dateCreated: string;
  lastUpdate: string;
  nextHearing: string | null;
  description: string;
  assignedStudent: string;
  advisor: string;
}

const mockCases: Case[] = [
  {
    id: "1",
    caseNumber: "CASO-2024-001",
    clientName: "María González",
    caseType: "Derecho Civil",
    status: "activo",
    priority: "alta",
    dateCreated: "2024-01-15",
    lastUpdate: "2024-10-01",
    nextHearing: "2024-10-15",
    description: "Demanda por incumplimiento de contrato de servicios profesionales",
    assignedStudent: "Ana Carolina Méndez Ruiz",
    advisor: "Dr. Carlos Eduardo Vargas Molina"
  },
  {
    id: "2",
    caseNumber: "CASO-2024-002",
    clientName: "Carlos Rodríguez",
    caseType: "Derecho Laboral",
    status: "pendiente",
    priority: "media",
    dateCreated: "2024-02-03",
    lastUpdate: "2024-09-28",
    nextHearing: null,
    description: "Despido improcedente y reclamación de indemnización",
    assignedStudent: "Miguel Andrés Torres Vargas",
    advisor: "Dra. Laura Patricia Ruiz Gómez"
  },
  {
    id: "3",
    caseNumber: "CASO-2024-003",
    clientName: "Ana Martínez",
    caseType: "Derecho Familiar",
    status: "revision",
    priority: "alta",
    dateCreated: "2024-03-10",
    lastUpdate: "2024-10-02",
    nextHearing: "2024-10-20",
    description: "Proceso de divorcio y custodia de menores",
    assignedStudent: "Carolina Isabel Herrera López",
    advisor: "Dr. Fernando José Acosta Núñez"
  },
  {
    id: "4",
    caseNumber: "CASO-2024-004",
    clientName: "Luis Fernández",
    caseType: "Derecho Penal",
    status: "activo",
    priority: "alta",
    dateCreated: "2024-04-22",
    lastUpdate: "2024-10-03",
    nextHearing: "2024-10-12",
    description: "Defensa en proceso por delito contra la salud pública",
    assignedStudent: "Sebastián Alejandro Morales Cruz",
    advisor: "Dr. Pablo Enrique Castillo Rodríguez"
  },
  {
    id: "5",
    caseNumber: "CASO-2024-005",
    clientName: "Carmen López",
    caseType: "Derecho Mercantil",
    status: "cerrado",
    priority: "baja",
    dateCreated: "2024-01-08",
    lastUpdate: "2024-08-15",
    nextHearing: null,
    description: "Constitución de sociedad mercantil y redacción de estatutos",
    assignedStudent: "Andrea Valentina Ospina Jiménez",
    advisor: "Dra. Mónica Alexandra Peña Suárez"
  },
  {
    id: "6",
    caseNumber: "CASO-2024-006",
    clientName: "Roberto Silva",
    caseType: "Derecho Civil",
    status: "activo",
    priority: "media",
    dateCreated: "2024-05-14",
    lastUpdate: "2024-09-30",
    nextHearing: "2024-10-18",
    description: "Reclamación de deudas y ejecución hipotecaria",
    assignedStudent: "Juan David Ramírez Ortega",
    advisor: "Dr. Ricardo Alberto Díaz Murillo"
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

export default function SupportCasesPage({onBack}: {onBack?: () => void}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [studentFilter, setStudentFilter] = useState("todos");

  const filteredCases = mockCases.filter(caso => {
    const matchesSearch = 
      caso.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.assignedStudent.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || caso.status === statusFilter;
    const matchesType = typeFilter === "todos" || caso.caseType === typeFilter;
    const matchesStudent = studentFilter === "todos" || caso.assignedStudent === studentFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesStudent;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const uniqueStudents = [...new Set(mockCases.map(c => c.assignedStudent))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </button>
            <h1 className="text-gray-900 mb-2 font-semibold">Supervisión de casos</h1>
            <p className="text-gray-600">Supervisa y apoya el trabajo de los estudiantes en todos los casos legales</p>
          </div>
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Estudiantes activos</p>
                <p className="text-xl text-gray-900">{uniqueStudents.length}</p>
              </div>
            </div>
          </div>

          
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente, número de caso, estudiante o descripción..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
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
            <SelectTrigger className="w-full lg:w-48">
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
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger className="w-full lg:w-64">
              <SelectValue placeholder="Estudiante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estudiantes</SelectItem>
              {uniqueStudents.map(student => (
                <SelectItem key={student} value={student}>{student}</SelectItem>
              ))}
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
                <Badge className={`text-xs ${getPriorityColor(caso.priority)}`}>
                  {caso.priority.charAt(0).toUpperCase() + caso.priority.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo:</span>
                <span className="text-gray-900">{caso.caseType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estudiante:</span>
                <span className="text-blue-600">{caso.assignedStudent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Asesor:</span>
                <span className="text-gray-900">{caso.advisor}</span>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-md transition-colors duration-200"
                href={`/pro-apoyo/gestionar-caso/${caso.id}`}
              >
                Supervisar
              </Link>
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
              setStudentFilter("todos");
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}