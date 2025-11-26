'use client';
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Navbar } from "app/asesor/components/NavBarAsesor";


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const {id} = React.use(params)
  const [approvalNotes, setApprovalNotes] = useState("");
  const [caseStatus, setCaseStatus] = useState("pending_approval");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - En producción vendría de la API
  const caseData = {
    id: id,
    caseNumber: "CJ-2024-001",
    status: "pending_approval",
    createdDate: "2024-01-15",
    
    // Cliente
    clientName: "María González",
    clientId: "12345678",
    clientPhone: "3001234567",
    clientEmail: "maria.gonzalez@email.com",
    clientGender: "F",
    
    // Demandado
    defendantName: "Empresa ABC S.A.S",
    defendantType: "company",
    defendantId: "900123456",
    defendantPhone: "6012345678",
    defendantEmail: "legal@empresaabc.com",
    
    // Información del caso
    area: "Laboral",
    type: "Despido injustificado",
    summary: "La cliente María González fue despedida sin justa causa de la empresa ABC S.A.S el día 10 de enero de 2024. Trabajó por 3 años como auxiliar contable. No recibió preaviso ni indemnización correspondiente. Solicita asesoría para reclamación de sus derechos laborales.",
    facts: "1. Contrato laboral a término indefinido desde enero 2021\n2. Despido verbal el 10 de enero 2024\n3. No se otorgó preaviso ni indemnización\n4. Salario devengado: $1.200.000\n5. No hay procesos disciplinarios previos",
    
    // Asignaciones
    assignedStudent: {
      id: "1",
      name: "Andrea Vargas",
      email: "andrea.vargas@universidad.edu",
      semester: 9,
      specialization: "Laboral"
    },
    assignedAdvisor: {
      id: "1",
      name: "Dr. Roberto Silva",
      email: "roberto.silva@universidad.edu",
      specialization: ["Laboral", "Seguridad Social"]
    },
    
    // Observaciones del asesor
    advisorNotes: [],
    
    // Aprobación
    requiresApproval: true,
    approvalStatus: "pending",
    approvalDate: null,
    approvalNotes: ""
  };

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

  const handleApproveCase = async () => {
    if (!approvalNotes.trim()) {
      alert("Por favor ingresa las observaciones de aprobación");
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí iría la llamada a la API
      console.log('Aprobando caso:', {
        id: caseData.id,
        status: caseStatus,
        notes: approvalNotes
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Caso procesado exitosamente');
    } catch (error) {
      console.error('Error procesando caso:', error);
      alert('Error al procesar el caso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
        <Navbar />
        <main>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/asesor/mis-casos"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors cursor-pointer hover:underline"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis casos
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-gray-900">{caseData.caseNumber}</h1>
              {getStatusBadge(caseData.status)}
            </div>
            <p className="text-gray-600">Cliente: {caseData.clientName}</p>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Caso */}
          <Card className="p-6">
            <h2 className="text-gray-900 mb-4">Información del Caso</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-600">Área:</span>
                <p className="text-gray-900">{caseData.area}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tipo de caso:</span>
                <p className="text-gray-900">{caseData.type}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-sm text-gray-600">Resumen:</span>
              <p className="text-gray-900 mt-2">{caseData.summary}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Hechos del caso:</span>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <pre className="text-sm text-gray-900 whitespace-pre-wrap">{caseData.facts}</pre>
              </div>
            </div>
          </Card>

          {/* Información del Cliente */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Información del Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Nombre completo:</span>
                <p className="text-gray-900">{caseData.clientName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Documento:</span>
                <p className="text-gray-900">{caseData.clientId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Teléfono:</span>
                <p className="text-gray-900">{caseData.clientPhone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-gray-900">{caseData.clientEmail}</p>
              </div>
            </div>
          </Card>

          {/* Información del Demandado */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Información del Demandado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Nombre/Razón social:</span>
                <p className="text-gray-900">{caseData.defendantName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">NIT/Documento:</span>
                <p className="text-gray-900">{caseData.defendantId}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Teléfono:</span>
                <p className="text-gray-900">{caseData.defendantPhone}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-gray-900">{caseData.defendantEmail}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asignaciones */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Asignaciones</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Estudiante asignado:</span>
                <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-900">{caseData.assignedStudent.name}</p>
                  <p className="text-blue-700 text-sm">{caseData.assignedStudent.email}</p>
                  <p className="text-blue-700 text-xs">
                    Semestre {caseData.assignedStudent.semester} • {caseData.assignedStudent.specialization}
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Asesor asignado:</span>
                <div className="mt-1 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-900">{caseData.assignedAdvisor.name}</p>
                  <p className="text-green-700 text-sm">{caseData.assignedAdvisor.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {caseData.assignedAdvisor.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-green-700">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>


          {/* Estado del caso (si ya está aprobado) */}
          {caseData.status !== "pending_approval" && (
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Estado del Caso</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-900">Caso Aprobado</p>
                    <p className="text-green-700 text-sm">En seguimiento activo</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
        </main>
    </div>
    
  );
}