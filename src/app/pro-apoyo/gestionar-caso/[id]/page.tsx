'use client'
import { useState } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Nav } from "react-day-picker";
import { Navbar } from "app/pro-apoyo/components/NavBarProApoyo";
import {useRouter} from 'next/navigation';
import Link from "next/link";
interface RepresentedPerson {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  edad: string;
}

interface ClientDetails {
  nombre: string;
  sexo: string;
  cedula: string;
  telefono: string;
  edad: string;
  contactoFamiliar: string;
  estadoCivil: string;
  estrato: string;
  direccion: string;
  correo: string;
  tipoVivienda: string;
  situacionLaboral: string;
  otrosIngresos: string;
  valorOtrosIngresos: string;
  conceptoOtrosIngresos: string;
  personaRepresentada?: RepresentedPerson;
}

interface DefendantDetails {
  nombreCompleto: string;
  documento: string;
  celular: string;
  lugarResidencia: string;
  correo: string;
}

interface StudentData {
  nombre: string;
  semestre: string;
  jornada: string;
  correo: string;
  cedula: string;
  turno: string;
}

interface CaseDetails {
  id: string;
  caseNumber: string;
  client: ClientDetails;
  defendant: DefendantDetails;
  caseType: string;
  status: "activo" | "pendiente" | "cerrado" | "revision";
  dateCreated: string;
  lastUpdate: string;
  nextHearing: string | null;
  resumenHechos: string;
  casoAprobado: boolean;
  tipoProceso: string;
  estudianteAsignado: string;
  asesorAsignado: string;
  studentData: StudentData;
  courtAssigned: string;
  judgeAssigned: string;
  opposingParty: string;
  opposingCounsel: string;
  estimatedValue: string;
  notes: string[];
  supervisorNotes: string[];
  documents: { name: string; type: string; uploadDate: string; }[];
  timeline: { date: string; event: string; description: string; author: string; }[];
  tasks: { task: string; dueDate: string; completed: boolean; assignedBy: string; }[];
}

const mockCaseDetails: CaseDetails = {
  id: "1",
  caseNumber: "CASO-2024-001",
  client: {
    nombre: "María González Rodríguez",
    sexo: "Femenino",
    cedula: "12345678",
    telefono: "+57 300 123 4567",
    edad: "35",
    contactoFamiliar: "Pedro González (hermano) - +57 310 987 6543",
    estadoCivil: "Soltera",
    estrato: "3",
    direccion: "Carrera 15 #45-23, Bogotá D.C.",
    correo: "maria.gonzalez@email.com",
    tipoVivienda: "Apartamento propio",
    situacionLaboral: "Empleada independiente",
    otrosIngresos: "Sí",
    valorOtrosIngresos: "$800.000 COP",
    conceptoOtrosIngresos: "Vendedor comerciante",
    personaRepresentada: {
      nombreCompleto: "Sofía González Pérez",
      tipoDocumento: "Tarjeta De Identidad",
      numeroDocumento: "52452352",
      edad: "16"
    }
  },
  defendant: {
    nombreCompleto: "TechSolutions S.L.",
    documento: "NIT 901.234.567-8",
    celular: "+57 601 234 5678",
    lugarResidencia: "Carrera 11 #93-07, Piso 8, Bogotá D.C.",
    correo: "legal@techsolutions.com.co"
  },
  caseType: "Derecho Civil",
  status: "activo",
  dateCreated: "2024-01-15",
  lastUpdate: "2024-10-01",
  nextHearing: "2024-10-15",
  resumenHechos: "La cliente María González contrató los servicios profesionales de TechSolutions S.L. para el desarrollo de una plataforma digital por un valor de $45.000.000 COP. La empresa incumplió con las especificaciones técnicas acordadas y los plazos de entrega establecidos en el contrato. Después de múltiples intentos de solución amigable, la cliente solicita el cumplimiento del contrato o la resolución del mismo con indemnización por daños y perjuicios.",
  casoAprobado: true,
  tipoProceso: "Proceso Ordinario - Radicado 11001-31-03-012-2024-00156-00",
  estudianteAsignado: "Ana Carolina Méndez Ruiz",
  asesorAsignado: "Dr. Carlos Eduardo Vargas Molina",
  studentData: {
    nombre: "Ana Carolina Méndez Ruiz",
    semestre: "VIII",
    jornada: "Diurna",
    correo: "ana.mendez@estudiantes.consultorijuridico.edu.co",
    cedula: "1023456789",
    turno: "Mañana"
  },
  courtAssigned: "Juzgado de Primera Instancia nº 12 de Bogotá",
  judgeAssigned: "Dra. Carmen Martínez López",
  opposingParty: "TechSolutions S.L.",
  opposingCounsel: "Bufete Jurídico Asociados - Dr. Juan Carlos Pérez",
  estimatedValue: "$45.000.000 COP",
  notes: [
    "Cliente muy colaborativa y organizada con la documentación",
    "Caso con alta probabilidad de éxito según precedentes",
    "Mantener comunicación frecuente debido a la urgencia del caso"
  ],
  supervisorNotes: [
    "Revisar estrategia de litigación con el estudiante",
    "Solicitar actualización semanal del progreso del caso",
    "Excelente trabajo del estudiante en la preparación inicial"
  ],
  documents: [
    { name: "Contrato original de servicios", type: "PDF", uploadDate: "2024-01-15" },
    { name: "Correspondencia con la empresa", type: "PDF", uploadDate: "2024-01-20" },
    { name: "Facturación y pagos realizados", type: "Excel", uploadDate: "2024-01-25" },
    { name: "Demanda presentada", type: "PDF", uploadDate: "2024-02-01" },
    { name: "Contestación de la demanda", type: "PDF", uploadDate: "2024-03-15" }
  ],
  timeline: [
    { date: "2024-01-15", event: "Inicio del caso", description: "Primera consulta con la cliente y recopilación de documentación inicial", author: "Ana Carolina Méndez Ruiz" },
    { date: "2024-02-01", event: "Demanda presentada", description: "Presentación de la demanda en el Juzgado de Primera Instancia nº 12", author: "Ana Carolina Méndez Ruiz" },
    { date: "2024-03-15", event: "Contestación recibida", description: "La parte demandada presenta contestación a la demanda", author: "Sistema" },
    { date: "2024-04-20", event: "Audiencia previa", description: "Celebración de audiencia previa - No hubo acuerdo", author: "Ana Carolina Méndez Ruiz" },
    { date: "2024-09-10", event: "Período probatorio", description: "Inicio del período probatorio - Presentación de documentos", author: "Ana Carolina Méndez Ruiz" },
    { date: "2024-10-01", event: "Supervisión realizada", description: "Revisión del caso y estrategia con el asesor", author: "Dr. Carlos Eduardo Vargas Molina" }
  ],
  tasks: [
    { task: "Preparar alegatos finales", dueDate: "2024-10-12", completed: false, assignedBy: "Dr. Carlos Eduardo Vargas Molina" },
    { task: "Revisar jurisprudencia reciente", dueDate: "2024-10-10", completed: true, assignedBy: "Ana Carolina Méndez Ruiz" },
    { task: "Contactar con perito contable", dueDate: "2024-10-08", completed: true, assignedBy: "Dr. Carlos Eduardo Vargas Molina" },
    { task: "Enviar escritos complementarios", dueDate: "2024-10-14", completed: false, assignedBy: "Ana Carolina Méndez Ruiz" }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "activo": return "bg-green-100 text-green-800 border-green-200";
    case "pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cerrado": return "bg-gray-100 text-gray-800 border-gray-200";
    case "revision": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [newSupervisorNote, setNewSupervisorNote] = useState("");
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editedStudentData, setEditedStudentData] = useState<StudentData | null>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<ClientDetails | null>(null);
  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] = useState<DefendantDetails | null>(null);
  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<any>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const caso = mockCaseDetails; // In real app, you'd fetch by caseId

  const handleEditStudent = () => {
    setEditedStudentData({ ...caso.studentData });
    setIsEditingStudent(true);
  };

  const handleSaveStudent = () => {
    if (editedStudentData) {
      // In a real app, you would save to the backend here
      console.log('Guardando datos del estudiante:', editedStudentData);
      setIsEditingStudent(false);
      setEditedStudentData(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStudent(false);
    setEditedStudentData(null);
  };

  const handleStudentDataChange = (field: keyof StudentData, value: string) => {
    if (editedStudentData) {
      setEditedStudentData({
        ...editedStudentData,
        [field]: value
      });
    }
  };

  // Client editing functions
  const handleEditClient = () => {
    setEditedClientData({ ...caso.client });
    setIsEditingClient(true);
  };

  const handleSaveClient = () => {
    if (editedClientData) {
      console.log('Guardando datos del cliente:', editedClientData);
      setIsEditingClient(false);
      setEditedClientData(null);
    }
  };

  const handleCancelClientEdit = () => {
    setIsEditingClient(false);
    setEditedClientData(null);
  };

  const handleClientDataChange = (field: keyof ClientDetails, value: string) => {
    if (editedClientData) {
      setEditedClientData({
        ...editedClientData,
        [field]: value
      });
    }
  };

  const handleRepresentedPersonChange = (field: keyof RepresentedPerson, value: string) => {
    if (editedClientData && editedClientData.personaRepresentada) {
      setEditedClientData({
        ...editedClientData,
        personaRepresentada: {
          ...editedClientData.personaRepresentada,
          [field]: value
        }
      });
    }
  };

  // Defendant editing functions
  const handleEditDefendant = () => {
    setEditedDefendantData({ ...caso.defendant });
    setIsEditingDefendant(true);
  };

  const handleSaveDefendant = () => {
    if (editedDefendantData) {
      console.log('Guardando datos del demandado:', editedDefendantData);
      setIsEditingDefendant(false);
      setEditedDefendantData(null);
    }
  };

  const handleCancelDefendantEdit = () => {
    setIsEditingDefendant(false);
    setEditedDefendantData(null);
  };

  const handleDefendantDataChange = (field: keyof DefendantDetails, value: string) => {
    if (editedDefendantData) {
      setEditedDefendantData({
        ...editedDefendantData,
        [field]: value
      });
    }
  };

  // Case information editing functions
  const handleEditCaseInfo = () => {
    setEditedCaseData({
      caseType: caso.caseType,
      casoAprobado: caso.casoAprobado,
      tipoProceso: caso.tipoProceso,
      estudianteAsignado: caso.estudianteAsignado,
      asesorAsignado: caso.asesorAsignado,
      resumenHechos: caso.resumenHechos
    });
    setIsEditingCaseInfo(true);
  };

  const handleSaveCaseInfo = () => {
    if (editedCaseData) {
      console.log('Guardando información del caso:', editedCaseData);
      setIsEditingCaseInfo(false);
      setEditedCaseData(null);
    }
  };

  const handleCancelCaseEdit = () => {
    setIsEditingCaseInfo(false);
    setEditedCaseData(null);
  };

  const handleCaseDataChange = (field: string, value: string | boolean) => {
    if (editedCaseData) {
      setEditedCaseData({
        ...editedCaseData,
        [field]: value
      });
    }
  };

  // Notes editing functions
  const handleEditNotes = () => {
    setEditedNotes([...caso.notes]);
    setNewNote('');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    console.log('Guardando observaciones:', editedNotes);
    setIsEditingNotes(false);
    setEditedNotes([]);
    setNewNote('');
  };

  const handleCancelNotesEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes([]);
    setNewNote('');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setEditedNotes([...editedNotes, newNote.trim()]);
      setNewNote('');
    }
  };

  const handleEditNote = (index: number, value: string) => {
    const updatedNotes = [...editedNotes];
    updatedNotes[index] = value;
    setEditedNotes(updatedNotes);
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = editedNotes.filter((_, i) => i !== index);
    setEditedNotes(updatedNotes);
  };

  const displayStudentData = isEditingStudent ? editedStudentData : caso.studentData;
  const displayClientData = isEditingClient ? editedClientData : caso.client;
  const displayDefendantData = isEditingDefendant ? editedDefendantData : caso.defendant;
  const displayCaseData = isEditingCaseInfo ? editedCaseData : caso;
  const displayNotes = isEditingNotes ? editedNotes : caso.notes;

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/pro-apoyo/gestionar-caso"
              className="flex items-center text-blue-600 hover:text-blue-700 hover:underline mb-4 transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a supervisión de casos
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-gray-900 mb-2">{caso.caseNumber}</h1>
                <p className="text-gray-600">{caso.client.nombre}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 mr-2">Estudiante asignado:</span>
                  <span className="text-sm text-blue-600">{caso.estudianteAsignado}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Badge className={`text-sm ${getStatusColor(caso.status)} justify-center sm:justify-start`}>
                  {caso.status.charAt(0).toUpperCase() + caso.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>



          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="supervision">Datos estudiante</TabsTrigger>
              <TabsTrigger value="client">Cliente</TabsTrigger>
              <TabsTrigger value="defendant">Demandado</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Case Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-gray-900">Información del caso</h3>
                      </div>
                      {!isEditingCaseInfo ? (
                        <Button
                          onClick={handleEditCaseInfo}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Modificar información
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveCaseInfo}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar
                          </Button>
                          <Button
                            onClick={handleCancelCaseEdit}
                            size="sm"
                            variant="outline"
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>

                    {!isEditingCaseInfo ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-600">Tipo de caso</Label>
                          <p className="text-gray-900 mb-4">{displayCaseData?.caseType}</p>

                          <Label className="text-gray-600">Estado de aprobación</Label>
                          <div className="mb-4">
                            <Badge className={`${displayCaseData?.casoAprobado ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                              {displayCaseData?.casoAprobado ? 'Caso Aprobado' : 'Pendiente de Aprobación'}
                            </Badge>
                          </div>

                          <Label className="text-gray-600">Tipo de proceso</Label>
                          <p className="text-gray-900">{displayCaseData?.tipoProceso}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Estudiante asignado</Label>
                          <p className="text-blue-600 mb-4">{displayCaseData?.estudianteAsignado}</p>

                          <Label className="text-gray-600">Asesor asignado</Label>
                          <p className="text-gray-900">{displayCaseData?.asesorAsignado}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600">Tipo de caso</Label>
                            <Select
                              value={editedCaseData?.caseType || ''}
                              onValueChange={(value) => handleCaseDataChange('caseType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo de caso" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Laboral">Laboral</SelectItem>
                                <SelectItem value="Civil">Civil</SelectItem>
                                <SelectItem value="Penal">Penal</SelectItem>
                                <SelectItem value="Familia">Familia</SelectItem>
                                <SelectItem value="Comercial">Comercial</SelectItem>
                                <SelectItem value="Administrativo">Administrativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-gray-600">Estado de aprobación</Label>
                            <Select
                              value={editedCaseData?.casoAprobado ? 'true' : 'false'}
                              onValueChange={(value) => handleCaseDataChange('casoAprobado', value === 'true')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Estado de aprobación" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Caso Aprobado</SelectItem>
                                <SelectItem value="false">Pendiente de Aprobación</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-gray-600">Tipo de proceso</Label>
                            <Input
                              value={editedCaseData?.tipoProceso || ''}
                              onChange={(e) => handleCaseDataChange('tipoProceso', e.target.value)}
                              placeholder="Ej: Radicado 2024-001-123"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600">Estudiante asignado</Label>
                            <Input
                              value={editedCaseData?.estudianteAsignado || ''}
                              onChange={(e) => handleCaseDataChange('estudianteAsignado', e.target.value)}
                              placeholder="Nombre del estudiante asignado"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600">Asesor asignado</Label>
                            <Input
                              value={editedCaseData?.asesorAsignado || ''}
                              onChange={(e) => handleCaseDataChange('asesorAsignado', e.target.value)}
                              placeholder="Nombre del asesor asignado"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Resumen de los hechos</h3>
                    </div>

                    {!isEditingCaseInfo ? (
                      <p className="text-gray-600 leading-relaxed">{displayCaseData?.resumenHechos}</p>
                    ) : (
                      <Textarea
                        value={editedCaseData?.resumenHechos || ''}
                        onChange={(e) => handleCaseDataChange('resumenHechos', e.target.value)}
                        placeholder="Descripción detallada de los hechos del caso..."
                        className="min-h-32"
                      />
                    )}
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h3 className="text-gray-900">Observaciones</h3>
                      </div>
                      {!isEditingNotes ? (
                        <Button
                          onClick={handleEditNotes}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar observaciones
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveNotes}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar
                          </Button>
                          <Button
                            onClick={handleCancelNotesEdit}
                            size="sm"
                            variant="outline"
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>

                    {!isEditingNotes ? (
                      <div className="space-y-3">
                        {displayNotes.length > 0 ? (
                          displayNotes.map((note, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-gray-700 text-sm">{note}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm">No hay observaciones registradas</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Existing notes editing */}
                        <div className="space-y-3">
                          {editedNotes.map((note, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <Textarea
                                value={note}
                                onChange={(e) => handleEditNote(index, e.target.value)}
                                className="flex-1 min-h-16"
                                placeholder="Escribir observación..."
                              />
                              <Button
                                onClick={() => handleDeleteNote(index)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50 mt-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Add new note */}
                        <div className="border-t pt-4">
                          <Label className="text-gray-600 mb-2 block">Agregar nueva observación</Label>
                          <div className="flex gap-2">
                            <Textarea
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Escribir nueva observación..."
                              className="flex-1 min-h-16"
                            />
                            <Button
                              onClick={handleAddNote}
                              disabled={!newNote.trim()}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white mt-1"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Agregar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Fechas importantes</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-600">Creado</Label>
                        <p className="text-gray-900">{formatDate(caso.dateCreated)}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Última actualización</Label>
                        <p className="text-gray-900">{formatDate(caso.lastUpdate)}</p>
                      </div>
                      {caso.nextHearing && (
                        <div>
                          <Label className="text-gray-600">Próxima audiencia</Label>
                          <p className="text-blue-600">{formatDate(caso.nextHearing)}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-900">Equipo asignado</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-600">Estudiante</Label>
                        <p className="text-blue-600">{caso.estudianteAsignado}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Asesor</Label>
                        <p className="text-gray-900">{caso.asesorAsignado}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Student Data Tab */}
            <TabsContent value="supervision" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900">Información del estudiante</h3>
                  </div>
                  {!isEditingStudent ? (
                    <Button
                      onClick={handleEditStudent}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Modificar información
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveStudent}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                {!isEditingStudent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      <p className="text-gray-900">{displayStudentData?.nombre}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      <p className="text-gray-900">{displayStudentData?.cedula}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Correo electrónico</Label>
                      <p className="text-blue-600">{displayStudentData?.correo}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Semestre</Label>
                      <p className="text-gray-900">{displayStudentData?.semestre}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Jornada</Label>
                      <p className="text-gray-900">{displayStudentData?.jornada}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Turno</Label>
                      <p className="text-gray-900">{displayStudentData?.turno}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      <Input
                        value={editedStudentData?.nombre || ''}
                        onChange={(e) => handleStudentDataChange('nombre', e.target.value)}
                        placeholder="Nombre completo del estudiante"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      <Input
                        value={editedStudentData?.cedula || ''}
                        onChange={(e) => handleStudentDataChange('cedula', e.target.value)}
                        placeholder="Número de cédula"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Correo electrónico</Label>
                      <Input
                        type="email"
                        value={editedStudentData?.correo || ''}
                        onChange={(e) => handleStudentDataChange('correo', e.target.value)}
                        placeholder="correo@estudiantes.consultorijuridico.edu.co"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Semestre</Label>
                      <Select
                        value={editedStudentData?.semestre || ''}
                        onValueChange={(value) => handleStudentDataChange('semestre', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar semestre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="I">I</SelectItem>
                          <SelectItem value="II">II</SelectItem>
                          <SelectItem value="III">III</SelectItem>
                          <SelectItem value="IV">IV</SelectItem>
                          <SelectItem value="V">V</SelectItem>
                          <SelectItem value="VI">VI</SelectItem>
                          <SelectItem value="VII">VII</SelectItem>
                          <SelectItem value="VIII">VIII</SelectItem>
                          <SelectItem value="IX">IX</SelectItem>
                          <SelectItem value="X">X</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Jornada</Label>
                      <Select
                        value={editedStudentData?.jornada || ''}
                        onValueChange={(value) => handleStudentDataChange('jornada', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar jornada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diurna">Diurna</SelectItem>
                          <SelectItem value="Nocturna">Nocturna</SelectItem>
                          <SelectItem value="Fin de semana">Fin de semana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Turno</Label>
                      <Select
                        value={editedStudentData?.turno || ''}
                        onValueChange={(value) => handleStudentDataChange('turno', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar turno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mañana">Mañana</SelectItem>
                          <SelectItem value="Tarde">Tarde</SelectItem>
                          <SelectItem value="Noche">Noche</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </Card>


            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-6">
              {/* Personal Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900">Información personal</h3>
                  </div>
                  {!isEditingClient ? (
                    <Button
                      onClick={handleEditClient}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Modificar información
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveClient}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancelClientEdit}
                        size="sm"
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                {!isEditingClient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      <p className="text-gray-900">{displayClientData?.nombre}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Sexo</Label>
                      <p className="text-gray-900">{displayClientData?.sexo}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      <p className="text-gray-900">{displayClientData?.cedula}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Edad</Label>
                      <p className="text-gray-900">{displayClientData?.edad} años</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado civil</Label>
                      <p className="text-gray-900">{displayClientData?.estadoCivil}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estrato</Label>
                      <p className="text-gray-900">{displayClientData?.estrato}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      <Input
                        value={editedClientData?.nombre || ''}
                        onChange={(e) => handleClientDataChange('nombre', e.target.value)}
                        placeholder="Nombre completo del cliente"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Sexo</Label>
                      <Select
                        value={editedClientData?.sexo || ''}
                        onValueChange={(value) => handleClientDataChange('sexo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      <Input
                        value={editedClientData?.cedula || ''}
                        onChange={(e) => handleClientDataChange('cedula', e.target.value)}
                        placeholder="Número de cédula"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Edad</Label>
                      <Input
                        type="number"
                        value={editedClientData?.edad || ''}
                        onChange={(e) => handleClientDataChange('edad', e.target.value)}
                        placeholder="Edad"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado civil</Label>
                      <Select
                        value={editedClientData?.estadoCivil || ''}
                        onValueChange={(value) => handleClientDataChange('estadoCivil', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Soltero/a">Soltero/a</SelectItem>
                          <SelectItem value="Casado/a">Casado/a</SelectItem>
                          <SelectItem value="Divorciado/a">Divorciado/a</SelectItem>
                          <SelectItem value="Viudo/a">Viudo/a</SelectItem>
                          <SelectItem value="Unión libre">Unión libre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estrato</Label>
                      <Select
                        value={editedClientData?.estrato || ''}
                        onValueChange={(value) => handleClientDataChange('estrato', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estrato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información de contacto</h3>
                </div>

                {!isEditingClient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Teléfono</Label>
                      <p className="text-gray-900 mb-4">{displayClientData?.telefono}</p>

                      <Label className="text-gray-600">Correo electrónico</Label>
                      <p className="text-blue-600 mb-4">{displayClientData?.correo}</p>

                      <Label className="text-gray-600">Dirección</Label>
                      <p className="text-gray-900">{displayClientData?.direccion}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Contacto de familiar</Label>
                      <p className="text-gray-900 mb-4">{displayClientData?.contactoFamiliar}</p>

                      <Label className="text-gray-600">Tipo de vivienda</Label>
                      <p className="text-gray-900">{displayClientData?.tipoVivienda}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Teléfono</Label>
                        <Input
                          value={editedClientData?.telefono || ''}
                          onChange={(e) => handleClientDataChange('telefono', e.target.value)}
                          placeholder="+57 300 123 4567"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Correo electrónico</Label>
                        <Input
                          type="email"
                          value={editedClientData?.correo || ''}
                          onChange={(e) => handleClientDataChange('correo', e.target.value)}
                          placeholder="correo@email.com"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Dirección</Label>
                        <Textarea
                          value={editedClientData?.direccion || ''}
                          onChange={(e) => handleClientDataChange('direccion', e.target.value)}
                          placeholder="Dirección completa"
                          className="min-h-16"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Contacto de familiar</Label>
                        <Input
                          value={editedClientData?.contactoFamiliar || ''}
                          onChange={(e) => handleClientDataChange('contactoFamiliar', e.target.value)}
                          placeholder="Nombre (relación) - Teléfono"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Tipo de vivienda</Label>
                        <Select
                          value={editedClientData?.tipoVivienda || ''}
                          onValueChange={(value) => handleClientDataChange('tipoVivienda', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de vivienda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Casa propia">Casa propia</SelectItem>
                            <SelectItem value="Apartamento propio">Apartamento propio</SelectItem>
                            <SelectItem value="Casa arrendada">Casa arrendada</SelectItem>
                            <SelectItem value="Apartamento arrendado">Apartamento arrendado</SelectItem>
                            <SelectItem value="Casa familiar">Casa familiar</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Financial Information */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información laboral y financiera</h3>
                </div>

                {!isEditingClient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Situación laboral</Label>
                      <p className="text-gray-900 mb-4">{displayClientData?.situacionLaboral}</p>

                      <Label className="text-gray-600">Otros ingresos</Label>
                      <p className="text-gray-900">{displayClientData?.otrosIngresos}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Valor de otros ingresos</Label>
                      <p className="text-gray-900 mb-4">{displayClientData?.valorOtrosIngresos}</p>

                      <Label className="text-gray-600">Concepto de otros ingresos</Label>
                      <p className="text-gray-900">{displayClientData?.conceptoOtrosIngresos}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Situación laboral</Label>
                        <Select
                          value={editedClientData?.situacionLaboral || ''}
                          onValueChange={(value) => handleClientDataChange('situacionLaboral', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Situación laboral" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Empleado">Empleado</SelectItem>
                            <SelectItem value="Empleada independiente">Empleado independiente</SelectItem>
                            <SelectItem value="Desempleado">Desempleado</SelectItem>
                            <SelectItem value="Estudiante">Estudiante</SelectItem>
                            <SelectItem value="Pensionado">Pensionado</SelectItem>
                            <SelectItem value="Ama de casa">Ama de casa</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-600">Otros ingresos</Label>
                        <Select
                          value={editedClientData?.otrosIngresos || ''}
                          onValueChange={(value) => handleClientDataChange('otrosIngresos', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="¿Tiene otros ingresos?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sí">Sí</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Valor de otros ingresos</Label>
                        <Input
                          value={editedClientData?.valorOtrosIngresos || ''}
                          onChange={(e) => handleClientDataChange('valorOtrosIngresos', e.target.value)}
                          placeholder="$800.000 COP"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Concepto de otros ingresos</Label>
                        <Input
                          value={editedClientData?.conceptoOtrosIngresos || ''}
                          onChange={(e) => handleClientDataChange('conceptoOtrosIngresos', e.target.value)}
                          placeholder="Descripción del ingreso"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              
            </TabsContent>

            {/* Defendant Tab */}
            <TabsContent value="defendant" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900">Información del demandado</h3>
                  </div>
                  {!isEditingDefendant ? (
                    <Button
                      onClick={handleEditDefendant}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Modificar información
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveDefendant}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancelDefendantEdit}
                        size="sm"
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                {!isEditingDefendant ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      <p className="text-gray-900 mb-4">{displayDefendantData?.nombreCompleto}</p>

                      <Label className="text-gray-600">Documento</Label>
                      <p className="text-gray-900 mb-4">{displayDefendantData?.documento}</p>

                      <Label className="text-gray-600">Celular</Label>
                      <p className="text-gray-900">{displayDefendantData?.celular}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Lugar de residencia</Label>
                      <p className="text-gray-900 mb-4">{displayDefendantData?.lugarResidencia}</p>

                      <Label className="text-gray-600">Correo electrónico</Label>
                      <p className="text-blue-600">{displayDefendantData?.correo}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Nombre completo</Label>
                        <Input
                          value={editedDefendantData?.nombreCompleto || ''}
                          onChange={(e) => handleDefendantDataChange('nombreCompleto', e.target.value)}
                          placeholder="Nombre completo o razón social"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Documento</Label>
                        <Input
                          value={editedDefendantData?.documento || ''}
                          onChange={(e) => handleDefendantDataChange('documento', e.target.value)}
                          placeholder="NIT, CC, etc."
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Celular</Label>
                        <Input
                          value={editedDefendantData?.celular || ''}
                          onChange={(e) => handleDefendantDataChange('celular', e.target.value)}
                          placeholder="+57 601 234 5678"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-600">Lugar de residencia</Label>
                        <Textarea
                          value={editedDefendantData?.lugarResidencia || ''}
                          onChange={(e) => handleDefendantDataChange('lugarResidencia', e.target.value)}
                          placeholder="Dirección completa"
                          className="min-h-16"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-600">Correo electrónico</Label>
                        <Input
                          type="email"
                          value={editedDefendantData?.correo || ''}
                          onChange={(e) => handleDefendantDataChange('correo', e.target.value)}
                          placeholder="correo@email.com"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
            
          </Tabs>
        </div>
      </main>
    </div>

  );
}