"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Navbar } from "../components/NavBarProApoyo";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import { Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { get } from "http";

const getStatusColor = (status: string) => {
  switch (status) {
    case "aprobado": return "bg-green-100 text-green-800 border-green-200";
    case "en_proceso": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pendiente_aprobacion": return "bg-gray-100 text-gray-800 border-gray-200";
    case "archivado": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function SupportCasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [studentFilter, setStudentFilter] = useState("todos");
  const [casos, setCasos] = useState<Caso[] | null>(null);
  const [loading, setLoading] = useState(false);

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
  const observaciones = caso.observaciones?.toLowerCase() || "";
  const area = caso.area?.toLowerCase() || "";

  // Búsqueda general
  const matchesSearch =
    nombre.includes(searchTerm.toLowerCase()) ||
    cedula.includes(searchTerm.toLowerCase()) ||
    observaciones.includes(searchTerm.toLowerCase()) ||
    area.includes(searchTerm.toLowerCase());

  // Estado, área y estudiante
  const matchesStatus = statusFilter === "todos" || caso.estado === statusFilter;
  const matchesArea = typeFilter === "todos" || caso.area === typeFilter;
  const matchesStudent =
    studentFilter === "todos" ||
    caso.estudiantes_casos?.some(
      ec => ec.estudiante.perfil.nombre_completo === studentFilter
    );

  return matchesSearch && matchesStatus && matchesArea && matchesStudent;
});


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const uniqueStudents = [...new Set(casos?.map(c => c.estudiantes_casos?.map(ec => ec.estudiante.perfil.nombre_completo)).flat())];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex items-center justify-center bg-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-14 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link
                  href={'/pro-apoyo/inicio'}
                  className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver al inicio
                </Link>
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
                    <p className="text-xl text-gray-900">{casos?.length}</p>
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
                    <p className="text-xl text-gray-900">{casos?.filter(c => c.estado === 'aprobado').length}</p>
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
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="pendiente_aprobacion">Pendiente de aprobación</SelectItem>
                  <SelectItem value="archivado">Archivado</SelectItem>
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
                  {
                    uniqueStudents.length > 0 ? (
                      uniqueStudents.map(student => (
                        <SelectItem key={student} value={student}>{student}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="ninguno">No hay estudiantes disponibles</SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {filteredCases?.map((caso) => (
              <Card key={caso.id_caso} className="p-6 hover:shadow-md max-w-2xl transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">No. Caso: {caso.id_caso}</h3>
                    <p className="text-gray-600">Usuario: <span className="font-semibold">{caso.usuarios.nombre_completo}</span></p>
                    <p className="text-gray-800">Documento: {caso.usuarios.cedula}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={`text-xs ${getStatusColor(caso.estado)}`}>
                      {caso.estado.charAt(0).toUpperCase() + caso.estado.slice(1)}
                    </Badge>

                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Área:</span>
                    <span className="text-gray-900">{caso.area}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estudiante:</span>
                    <span className="text-blue-600">
                      {caso?.estudiantes_casos.length ? (
                        <p className="text-blue-600">{caso?.estudiantes_casos.map(estudiante => estudiante.estudiante.perfil.nombre_completo).join(', ')}</p>
                      ) : (
                        <p className="text-gray-600">No hay estudiantes asignados</p>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Asesor:</span>

                    <span className="text-gray-900">
                      {caso?.asesores_casos.length ? (
                        <p className="text-blue-600">{caso?.asesores_casos.map(asesor => asesor.asesor.perfil.nombre_completo).join(', ')}</p>
                      ) : (
                        <p className="text-gray-600">No hay asesores asignados</p>
                      )}</span>
                  </div>

                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {caso.resumen_hechos ?? (
                    <span className="italic text-gray-400">No hay resumen de los hechos por ahora.</span>
                  )}
                </p>

                <div className="flex gap-2">
                  <Link
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-md transition-colors duration-200"
                    href={`/pro-apoyo/gestionar-caso/${caso.id_caso}`}
                  >
                    Supervisar
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {filteredCases?.length === 0 && (
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
      </main>
    </div>

  );
}