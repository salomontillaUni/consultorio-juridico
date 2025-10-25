import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface CaseDetails {
  id: string;
  caseNumber: string;
  client: ClientDetails;
  defendant: DefendantDetails;
  caseType: string;
  status: "activo" | "pendiente" | "cerrado" | "revision";
  priority: "alta" | "media" | "baja";
  dateCreated: string;
  lastUpdate: string;
  nextHearing: string | null;
  resumenHechos: string;
  casoAprobado: boolean;
  tipoProceso: string;
  estudianteAsignado: string;
  asesorAsignado: string;
  courtAssigned: string;
  judgeAssigned: string;
  opposingParty: string;
  opposingCounsel: string;
  estimatedValue: string;
  notes: string[];
  documents: { name: string; type: string; uploadDate: string; }[];
  timeline: { date: string; event: string; description: string; }[];
  tasks: { task: string; dueDate: string; completed: boolean; }[];
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
  priority: "alta",
  dateCreated: "2024-01-15",
  lastUpdate: "2024-10-01",
  nextHearing: "2024-10-15",
  resumenHechos: "La cliente María González contrató los servicios profesionales de TechSolutions S.L. para el desarrollo de una plataforma digital por un valor de $45.000.000 COP. La empresa incumplió con las especificaciones técnicas acordadas y los plazos de entrega establecidos en el contrato. Después de múltiples intentos de solución amigable, la cliente solicita el cumplimiento del contrato o la resolución del mismo con indemnización por daños y perjuicios.",
  casoAprobado: true,
  tipoProceso: "Proceso Ordinario - Radicado 11001-31-03-012-2024-00156-00",
  estudianteAsignado: "Ana Carolina Méndez Ruiz",
  asesorAsignado: "Dr. Carlos Eduardo Vargas Molina",
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
  documents: [
    { name: "Contrato original de servicios", type: "PDF", uploadDate: "2024-01-15" },
    { name: "Correspondencia con la empresa", type: "PDF", uploadDate: "2024-01-20" },
    { name: "Facturación y pagos realizados", type: "Excel", uploadDate: "2024-01-25" },
    { name: "Demanda presentada", type: "PDF", uploadDate: "2024-02-01" },
    { name: "Contestación de la demanda", type: "PDF", uploadDate: "2024-03-15" }
  ],
  timeline: [
    { date: "2024-01-15", event: "Inicio del caso", description: "Primera consulta con la cliente y recopilación de documentación inicial" },
    { date: "2024-02-01", event: "Demanda presentada", description: "Presentación de la demanda en el Juzgado de Primera Instancia nº 12" },
    { date: "2024-03-15", event: "Contestación recibida", description: "La parte demandada presenta contestación a la demanda" },
    { date: "2024-04-20", event: "Audiencia previa", description: "Celebración de audiencia previa - No hubo acuerdo" },
    { date: "2024-09-10", event: "Período probatorio", description: "Inicio del período probatorio - Presentación de documentos" },
    { date: "2024-10-01", event: "Última actualización", description: "Preparación para la vista oral del juicio" }
  ],
  tasks: [
    { task: "Preparar alegatos finales", dueDate: "2024-10-12", completed: false },
    { task: "Revisar jurisprudencia reciente", dueDate: "2024-10-10", completed: true },
    { task: "Contactar con perito contable", dueDate: "2024-10-08", completed: true },
    { task: "Enviar escritos complementarios", dueDate: "2024-10-14", completed: false }
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta": return "bg-red-100 text-red-800 border-red-200";
    case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "baja": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

interface CaseDetailsPageProps {
  caseId: string;
  onBack: () => void;
}

export default function CaseDetailsPage({ caseId, onBack }: CaseDetailsPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a mis casos
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-gray-900 mb-2">{caso.caseNumber}</h1>
            <p className="text-gray-600">{caso.client.nombre}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Badge className={`text-sm ${getStatusColor(caso.status)} justify-center sm:justify-start`}>
              {caso.status.charAt(0).toUpperCase() + caso.status.slice(1)}
            </Badge>
            <Badge className={`text-sm ${getPriorityColor(caso.priority)} justify-center sm:justify-start`}>
              Prioridad {caso.priority}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Editar caso
        </Button>        
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
          <TabsTrigger value="defendant">Demandado</TabsTrigger>
          <TabsTrigger value="timeline">Cronología</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información del caso</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-600">Tipo de caso</Label>
                    <p className="text-gray-900 mb-4">{caso.caseType}</p>
                    
                    <Label className="text-gray-600">Estado de aprobación</Label>
                    <div className="mb-4">
                      <Badge className={`${caso.casoAprobado ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                        {caso.casoAprobado ? 'Caso Aprobado' : 'Pendiente de Aprobación'}
                      </Badge>
                    </div>
                    
                    <Label className="text-gray-600">Tipo de proceso</Label>
                    <p className="text-gray-900">{caso.tipoProceso}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Estudiante asignado</Label>
                    <p className="text-gray-900 mb-4">{caso.estudianteAsignado}</p>
                    
                    <Label className="text-gray-600">Asesor asignado</Label>
                    <p className="text-gray-900">{caso.asesorAsignado}</p>
                  </div>
                </div>
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
                <p className="text-gray-600 leading-relaxed">{caso.resumenHechos}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Notas del caso</h3>
                </div>
                <div className="space-y-3 mb-4">
                  {caso.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-700 text-sm">{note}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Añadir nueva nota..."
                    value={newNote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                    className="min-h-20"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Añadir nota
                  </Button>
                </div>
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
                  
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Client Tab */}
        <TabsContent value="client" className="space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-gray-900">Información personal</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="text-gray-600">Nombre completo</Label>
                <p className="text-gray-900">{caso.client.nombre}</p>
              </div>
              <div>
                <Label className="text-gray-600">Sexo</Label>
                <p className="text-gray-900">{caso.client.sexo}</p>
              </div>
              <div>
                <Label className="text-gray-600">Cédula</Label>
                <p className="text-gray-900">{caso.client.cedula}</p>
              </div>
              <div>
                <Label className="text-gray-600">Edad</Label>
                <p className="text-gray-900">{caso.client.edad} años</p>
              </div>
              <div>
                <Label className="text-gray-600">Estado civil</Label>
                <p className="text-gray-900">{caso.client.estadoCivil}</p>
              </div>
              <div>
                <Label className="text-gray-600">Estrato</Label>
                <p className="text-gray-900">{caso.client.estrato}</p>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Teléfono</Label>
                <p className="text-gray-900 mb-4">{caso.client.telefono}</p>
                
                <Label className="text-gray-600">Correo electrónico</Label>
                <p className="text-gray-900 mb-4">{caso.client.correo}</p>
                
                <Label className="text-gray-600">Dirección</Label>
                <p className="text-gray-900">{caso.client.direccion}</p>
              </div>
              <div>
                <Label className="text-gray-600">Contacto de familiar</Label>
                <p className="text-gray-900 mb-4">{caso.client.contactoFamiliar}</p>
                
                <Label className="text-gray-600">Tipo de vivienda</Label>
                <p className="text-gray-900 mb-4">{caso.client.tipoVivienda}</p>
                
                <div className="space-y-2 mt-6">
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Llamar
                  </Button>
                </div>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Situación laboral</Label>
                <p className="text-gray-900 mb-4">{caso.client.situacionLaboral}</p>
                
                <Label className="text-gray-600">Otros ingresos</Label>
                <p className="text-gray-900">{caso.client.otrosIngresos}</p>
              </div>
              <div>
                <Label className="text-gray-600">Valor de otros ingresos</Label>
                <p className="text-gray-900 mb-4">{caso.client.valorOtrosIngresos}</p>
                
                <Label className="text-gray-600">Concepto de otros ingresos</Label>
                <p className="text-gray-900">{caso.client.conceptoOtrosIngresos}</p>
              </div>
            </div>
          </Card>

          {/* Represented Person */}
          {caso.client.personaRepresentada && (
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-pink-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-gray-900">Persona representada</h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-600">Nombre completo</Label>
                    <p className="text-gray-900">{caso.client.personaRepresentada.nombreCompleto}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tipo de documento</Label>
                    <p className="text-gray-900">{caso.client.personaRepresentada.tipoDocumento}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Número de documento</Label>
                    <p className="text-gray-900">{caso.client.personaRepresentada.numeroDocumento}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Edad</Label>
                    <p className="text-gray-900">{caso.client.personaRepresentada.edad} años</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Defendant Tab */}
        <TabsContent value="defendant" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-gray-900">Información del demandado</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Nombre completo</Label>
                <p className="text-gray-900 mb-4">{caso.defendant.nombreCompleto}</p>
                
                <Label className="text-gray-600">Documento</Label>
                <p className="text-gray-900 mb-4">{caso.defendant.documento}</p>
                
                <Label className="text-gray-600">Celular</Label>
                <p className="text-gray-900">{caso.defendant.celular}</p>
              </div>
              <div>
                <Label className="text-gray-600">Lugar de residencia</Label>
                <p className="text-gray-900 mb-4">{caso.defendant.lugarResidencia}</p>
                
                <Label className="text-gray-600">Correo electrónico</Label>
                <p className="text-gray-900 mb-4">{caso.defendant.correo}</p>
                
                <div className="space-y-2 mt-6">
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Llamar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900">Cronología del caso</h3>
            </div>
            <div className="space-y-4">
              {caso.timeline.map((event, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-gray-900">{event.event}</h4>
                      <span className="text-sm text-gray-500">{formatShortDate(event.date)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>        
      </Tabs>
    </div>
  );
}