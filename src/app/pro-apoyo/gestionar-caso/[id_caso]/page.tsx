'use client'
import { useEffect, useState } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "app/pro-apoyo/components/NavBarProApoyo";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Caso, Demandado, Estudiante, Usuario } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { formatDate, getStatusColor } from "../page";


export default function Page({ params }: { params: Promise<{ id_caso: string }> }) {
  const { id_caso } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editedStudentData, setEditedStudentData] = useState<Estudiante[] | null>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(null);
  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] = useState<Demandado | null>(null);
  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [newNote, setNewNote] = useState('');
  const [caso, setCaso] = useState<Caso>();

  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  async function traerDatos() {
    try {
      setLoading(true);
      setError(null);

      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(id_caso),
        getDemandadoByCasoId(id_caso),
      ]);

      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);
      setDemandado(demandadoFetch);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    traerDatos();
  }, []);


  const handleEditStudent = () => {
    const studentData: Estudiante[] = caso?.estudiantes_casos.map(ec => ec.estudiante) || [];
    setEditedStudentData(studentData);
    setIsEditingStudent(true);
  };

  const handleSaveStudent = () => {
    if (editedStudentData) {
      setIsEditingStudent(false);
      setEditedStudentData(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStudent(false);
    setEditedStudentData(null);
  };

  const handleStudentDataChange = (index: number, field: string, value: string) => {
    if (editedStudentData) {
      const updatedData = [...editedStudentData];
      const fieldParts = field.split('.');

      if (fieldParts.length === 2 && fieldParts[0] === 'perfil') {
        updatedData[index] = {
          ...updatedData[index],
          perfil: {
            ...updatedData[index].perfil,
            [fieldParts[1]]: value
          }
        };
      } else {
        updatedData[index] = {
          ...updatedData[index],
          [field]: value
        };
      }

      setEditedStudentData(updatedData);
    }
  };

  // Client editing functions
  const handleEditClient = () => {
    setEditedClientData(caso?.usuarios || null);
    setIsEditingClient(true);
  };

  const handleSaveClient = () => {
    if (editedClientData) {
      setIsEditingClient(false);
      setEditedClientData(null);
    }
  };

  const handleCancelClientEdit = () => {
    setIsEditingClient(false);
    setEditedClientData(null);
  };

  const handleClientDataChange = (field: keyof Usuario, value: string | boolean) => {
    if (editedClientData) {
      setEditedClientData({
        ...editedClientData,
        [field]: value
      });
    }
  };

  // Defendant editing functions
  const handleEditDefendant = () => {
    setEditedDefendantData(demandado || null);
    setIsEditingDefendant(true);
  };

  const handleSaveDefendant = () => {
    if (editedDefendantData) {
      setIsEditingDefendant(false);
      setEditedDefendantData(null);
    }
  };

  const handleCancelDefendantEdit = () => {
    setIsEditingDefendant(false);
    setEditedDefendantData(null);
  };

  const handleDefendantDataChange = (field: keyof Demandado, value: string) => {
    if (editedDefendantData) {
      setEditedDefendantData({
        ...editedDefendantData,
        [field]: value
      });
    }
  };

  // Case information editing functions
  const handleEditCaseInfo = () => {
    if (!caso) return;
    setEditedCaseData({
      area: caso.area,
      aprobacion_asesor: caso?.aprobacion_asesor,
      tipo_proceso: caso?.tipo_proceso,
      estudiantes_casos: caso?.estudiantes_casos,
      asesores_casos: caso?.asesores_casos,
      resumen_hechos: caso?.resumen_hechos,
      estado: caso?.estado,
      fecha_creacion: caso?.fecha_creacion,
      fecha_cierre: caso?.fecha_cierre,
      usuarios: caso?.usuarios,
      id_caso: caso?.id_caso,
      id_usuario: caso?.id_usuario,
      observaciones: caso?.observaciones,
    });
    setIsEditingCaseInfo(true);
  };

  const handleSaveCaseInfo = () => {
    if (editedCaseData) {
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
    setEditedNotes(caso?.observaciones || '');
    setNewNote('');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    setEditedNotes('');
    setNewNote('');
  };

  const handleCancelNotesEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes('');
    setNewNote('');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setEditedNotes(editedNotes + '\n' + newNote);
      setNewNote('');
    }
  };

  const handleEditNote = (index: number, value: string) => {
    const updatedNotes = [...editedNotes.split('\n')];
    updatedNotes[index] = value;
    setEditedNotes(updatedNotes.join('\n'));
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = editedNotes.split('\n').filter((_, i) => i !== index);
    setEditedNotes(updatedNotes.join('\n'));
  };
  const displayStudentData = isEditingStudent ? editedStudentData : caso?.estudiantes_casos.map(ec => ec.estudiante);
  const displayClientData = isEditingClient ? editedClientData : caso?.usuarios;
  const displayDefendantData = isEditingDefendant ? editedDefendantData : demandado;
  const displayCaseData = isEditingCaseInfo ? editedCaseData : caso;
  const displayNotes = isEditingNotes ? editedNotes : caso?.observaciones || '';

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
                <h1 className="text-gray-900 mb-2">{caso?.id_caso}</h1>
                <p className="text-gray-600">{caso?.usuarios.nombre_completo}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 mr-2">Estudiante asignado:</span>
                  <span className="text-sm text-blue-600">{caso?.estudiantes_casos.map(ec => ec.estudiante.perfil.nombre_completo).join(", ")}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {caso && (
                  <Badge className={`text-sm ${getStatusColor(caso?.estado)} justify-center sm:justify-start`}>
                    {caso?.estado}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-2 lg:grid-cols-${displayCaseData?.estudiantes_casos.length ? '4' : '3'}`}>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              {displayCaseData?.estudiantes_casos.length ? (
                <TabsTrigger value="supervision">Datos estudiante</TabsTrigger>
              ) : null}
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
                          <p className="text-gray-900 mb-4">{displayCaseData?.area}</p>

                          <Label className="text-gray-600">Estado de aprobación</Label>
                          <div className="mb-4">
                            <Badge className={`${displayCaseData?.aprobacion_asesor ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                              {displayCaseData?.aprobacion_asesor ? 'Caso Aprobado' : 'Pendiente de Aprobación'}
                            </Badge>
                          </div>

                          <Label className="text-gray-600">Tipo de proceso</Label>
                          <p className="text-gray-900">{displayCaseData?.tipo_proceso}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Estudiantes asignados</Label>
                          {displayCaseData?.estudiantes_casos.length ? (
                            <p className="text-blue-600 mb-4">{displayCaseData?.estudiantes_casos.map(estudiante =>
                              estudiante.estudiante.perfil.nombre_completo).join(', ')}</p>
                          ) : (
                            <p className="text-gray-600 mb-4">No hay estudiantes asignados</p>
                          )}


                          <Label className="text-gray-600">Asesores asignados</Label>
                          {displayCaseData?.asesores_casos.length ? (
                            <p className="text-gray-900">{displayCaseData?.asesores_casos.map(asesor =>
                              asesor.asesor.perfil.nombre_completo).join(', ')}</p>
                          ) : (
                            <p className="text-gray-600 mb-4">No hay asesores asignados</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600">Tipo de caso</Label>
                            <Select
                              value={editedCaseData?.area || ''}
                              onValueChange={(value) => handleCaseDataChange('area', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo de caso" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Laboral">Laboral</SelectItem>
                                <SelectItem value="Civil">Civil</SelectItem>
                                <SelectItem value="Penal">Penal</SelectItem>
                                <SelectItem value="Familia">Familia</SelectItem>
                                <SelectItem value="Administrativo">Administrativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-gray-600">Estado de aprobación</Label>
                            <Select
                              value={editedCaseData?.aprobacion_asesor ? 'true' : 'false'}
                              onValueChange={(value) => handleCaseDataChange('aprobacion_asesor', value === 'true')}
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
                              value={editedCaseData?.tipo_proceso || ''}
                              onChange={(e) => handleCaseDataChange('tipo_proceso', e.target.value)}
                              placeholder="Ej: Radicado 2024-001-123"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600">Estudiante asignado</Label>
                            <Input
                              value={editedCaseData?.estudiantes_casos.map((es) => es.estudiante.perfil.nombre_completo).join(', ') || ''}
                              onChange={(e) => handleCaseDataChange('estudianteAsignado', e.target.value)}
                              placeholder="Nombre del estudiante asignado"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600">Asesor asignado</Label>
                            <Input
                              value={editedCaseData?.asesores_casos.map((as) => as.asesor.perfil.nombre_completo).join(', ') || ''}
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
                      <p className="text-gray-600 leading-relaxed">{displayCaseData?.resumen_hechos}</p>
                    ) : (
                      <Textarea
                        value={editedCaseData?.resumen_hechos || ''}
                        onChange={(e) => handleCaseDataChange('resumen_hechos', e.target.value)}
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
                        {displayNotes ? (
                          displayNotes.split('\n').map((note: string, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-gray-700">{note}</p>
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
                          {editedNotes.split('\n').map((note, index) => (
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
                        {caso && <p className="text-gray-900">{formatDate(caso.fecha_creacion)}</p>}
                      </div>

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
                        {displayCaseData?.estudiantes_casos.length ? (
                          <p className="text-blue-600">{displayCaseData?.estudiantes_casos.map(estudiante => estudiante.estudiante.perfil.nombre_completo).join(', ')}</p>
                        ) : (
                          <p className="text-gray-600 mb-4">No hay estudiantes asignados</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-600">Asesor</Label>
                        {displayCaseData?.asesores_casos.length ? (
                          <p className="text-gray-900">{displayCaseData?.asesores_casos.map(asesor => asesor.asesor.perfil.nombre_completo).join(',  ')}</p>
                        ) : (
                          <p className="text-gray-600 mb-4">No hay asesores asignados</p>
                        )}
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
                      <p className="text-gray-900">{displayStudentData?.map(student => student.perfil.nombre_completo).join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      <p className="text-gray-900">{displayStudentData?.map(ec => ec.perfil.cedula).join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Correo electrónico</Label>
                      <p className="text-blue-600">{displayStudentData?.map(student => student.perfil.correo).join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Semestre</Label>
                      <p className="text-gray-900">{displayStudentData?.map(student => student.semestre).join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Jornada</Label>
                      <p className="text-gray-900">{displayStudentData?.map(student => student.jornada).join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Turno</Label>
                      <p className="text-gray-900">{displayStudentData?.map(student => student.turno).join(', ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Teléfono</Label>
                      <p className="text-gray-900">{displayStudentData?.map(student => student.perfil.telefono || 'No registrado').join(', ')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      {editedStudentData?.map((student, index) => (
                        <Input
                          key={student.perfil.id || index}
                          value={student.perfil.nombre_completo || ''}
                          onChange={(e) =>
                            handleStudentDataChange(index, 'perfil.nombre_completo', e.target.value)
                          }
                          placeholder={`Nombre completo del estudiante ${index + 1}`}
                          className="mb-2"
                        />
                      ))}
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      {editedStudentData?.map((student, index) => (
                        <Input
                          key={student.perfil.id || index}
                          value={student.perfil.cedula || ''}
                          onChange={(e) =>
                            handleStudentDataChange(index, 'perfil.cedula', e.target.value)
                          }
                          placeholder={`Cédula del estudiante ${index + 1}`}
                          className="mb-2"
                        />
                      ))}
                    </div>
                    <div>
                      <Label className="text-gray-600">Correo electrónico</Label>
                      {editedStudentData?.map((student, index) => (
                        <Input
                          key={student.perfil.id || index}
                          type="email"
                          value={student.perfil.correo || ''}
                          onChange={(e) =>
                            handleStudentDataChange(index, 'perfil.correo', e.target.value)
                          }
                          placeholder="correo@estudiantes.consultorijuridico.edu.co"
                          className="mb-2"
                        />
                      ))}
                    </div>
                    <div>
                      <Label className="text-gray-600">Semestre</Label>
                      {editedStudentData?.map((student, index) => (
                        <Select
                          key={student.perfil.id || index}
                          value={student.semestre.toString()}
                          onValueChange={(value) => handleStudentDataChange(index, 'semestre', value)}
                        >
                          <SelectTrigger className="mb-2">
                            <SelectValue placeholder="Seleccionar semestre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                      ))}
                    </div>
                    <div>
                      <Label className="text-gray-600">Jornada</Label>
                      {editedStudentData?.map((student, index) => (
                        <Select
                          key={student.perfil.id || index}
                          value={student.jornada || ''}
                          onValueChange={(value) => handleStudentDataChange(index, 'jornada', value)}
                        >
                          <SelectTrigger className="mb-2">
                            <SelectValue placeholder="Seleccionar jornada" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diurna">Diurna</SelectItem>
                            <SelectItem value="nocturna">Nocturna</SelectItem>
                            <SelectItem value="mixto">Mixto</SelectItem>
                          </SelectContent>
                        </Select>
                      ))}
                    </div>
                    <div>
                      <Label className="text-gray-600">Turno</Label>
                      {editedStudentData?.map((student, index) => (
                        <Select
                          key={student.perfil.id || index}
                          value={student.turno || ''}
                          onValueChange={(value) => handleStudentDataChange(index, 'turno', value)}
                        >
                          <SelectTrigger className="mb-2">
                            <SelectValue placeholder="Seleccionar turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9-11">9-11</SelectItem>
                            <SelectItem value="2-4">2-4</SelectItem>
                            <SelectItem value="4-6">4-6</SelectItem>
                          </SelectContent>
                        </Select>
                      ))}
                    </div>
                    <div>
                      <Label className="text-gray-600">Teléfono</Label>
                      {editedStudentData?.map((student, index) => (
                        <Input
                          key={student.perfil.id || index}
                          value={student.perfil.telefono || ''}
                          onChange={(e) => handleStudentDataChange(index, 'telefono', e.target.value)}
                        />
                      ))}
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
                      <p className="text-gray-900">{caso?.usuarios.nombre_completo}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Sexo</Label>
                      <p className="text-gray-900">{caso?.usuarios.sexo}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Cédula</Label>
                      <p className="text-gray-900">{caso?.usuarios.cedula}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Edad</Label>
                      <p className="text-gray-900">{caso?.usuarios.edad} años</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado civil</Label>
                      <p className="text-gray-900">{caso?.usuarios.estado_civil}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estrato</Label>
                      <p className="text-gray-900">{caso?.usuarios.estrato}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-600">Nombre completo</Label>
                      <Input
                        value={editedClientData?.nombre_completo || ''}
                        onChange={(e) => handleClientDataChange('nombre_completo', e.target.value)}
                        placeholder="Nombre completo del cliente"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Sexo</Label>
                      <Select
                        value={editedClientData?.sexo}
                        onValueChange={(value) => handleClientDataChange('sexo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
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
                        placeholder="Edad en años"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado civil</Label>
                      <Select
                        value={editedClientData?.estado_civil || ''}
                        onValueChange={(value) => handleClientDataChange('estado_civil', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soltero">Soltero</SelectItem>
                          <SelectItem value="casado">Casado</SelectItem>
                          <SelectItem value="union libre">Union Libre</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estrato</Label>
                      <Select
                        value={editedClientData?.estrato?.toString()}
                        onValueChange={(value) => handleClientDataChange('estrato', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estrato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Estrato 1</SelectItem>
                          <SelectItem value="2">Estrato 2</SelectItem>
                          <SelectItem value="3">Estrato 3</SelectItem>
                          <SelectItem value="4">Estrato 4</SelectItem>
                          <SelectItem value="5">Estrato 5</SelectItem>
                          <SelectItem value="6">Estrato 6</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </Card>
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
                      <p className="text-gray-900 mb-4">{caso?.usuarios.telefono}</p>

                      <Label className="text-gray-600">Correo electrónico</Label>
                      <p className="text-gray-900 mb-4">{caso?.usuarios.correo}</p>

                      <Label className="text-gray-600">Dirección</Label>
                      <p className="text-gray-900">{caso?.usuarios.direccion}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Contacto de familiar</Label>
                      <p className="text-gray-900 mb-4">{caso?.usuarios.contacto_familiar}</p>

                      <Label className="text-gray-600">Tipo de vivienda</Label>
                      <p className="text-gray-900 mb-4">{caso?.usuarios.tipo_vivienda}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Teléfono</Label>
                      <Input
                        value={editedClientData?.telefono || ''}
                        onChange={(e) => handleClientDataChange('telefono', e.target.value)}
                        placeholder="Número de teléfono"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Contacto de familiar</Label>
                      <Input
                        value={editedClientData?.contacto_familiar || ''}
                        onChange={(e) => handleClientDataChange('contacto_familiar', e.target.value)}
                        placeholder="Contacto de un familiar"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Correo electrónico</Label>
                      <Input
                        value={editedClientData?.correo || ''}
                        onChange={(e) => handleClientDataChange('correo', e.target.value)}
                        placeholder="Correo electrónico"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Tipo de vivienda</Label>
                      <Input
                        value={editedClientData?.tipo_vivienda || ''}
                        onChange={(e) => handleClientDataChange('tipo_vivienda', e.target.value)}
                        placeholder="Tipo de vivienda"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Dirección</Label>
                      <Input
                        value={editedClientData?.direccion || ''}
                        onChange={(e) => handleClientDataChange('direccion', e.target.value)}
                        placeholder="Dirección"
                        className="mb-4"
                      />
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
                      <p className="text-gray-900 mb-4">{caso?.usuarios.situacion_laboral}</p>

                      <Label className="text-gray-600">Otros ingresos</Label>
                      {caso?.usuarios.otros_ingresos ? (
                        <p className="text-gray-900 mb-4">Sí</p>
                      ) : (
                        <p className="text-gray-900 mb-4">No</p>
                      )}
                    </div>

                    {caso?.usuarios.otros_ingresos && (
                      <div>
                        <Label className="text-gray-600">Valor de otros ingresos</Label>
                        <p className="text-gray-900 mb-4">{caso?.usuarios.valor_otros_ingresos}</p>

                        <Label className="text-gray-600">Concepto de otros ingresos</Label>
                        <p className="text-gray-900">{caso?.usuarios.concepto_otros_ingresos}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Situación laboral</Label>
                      <Select
                        value={editedClientData?.situacion_laboral?.toString()}
                        onValueChange={(value) => handleClientDataChange('situacion_laboral', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar situación laboral" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dependiente">Dependiente</SelectItem>
                          <SelectItem value="desempleado">Desempleado</SelectItem>
                          <SelectItem value="independiente">Independiente</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Valor de otros ingresos</Label>
                      <Input
                        type="text"
                        value={editedClientData?.valor_otros_ingresos || ''}
                        onChange={(e) => handleClientDataChange('valor_otros_ingresos', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Otros ingresos</Label>
                      <Select
                        value={String(editedClientData?.otros_ingresos)}
                        onValueChange={(value) =>
                          handleClientDataChange('otros_ingresos', value === 'true')
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Sí</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-600">Concepto de otros ingresos</Label>
                      <Input
                        type="text"
                        value={editedClientData?.concepto_otros_ingresos || ''}
                        onChange={(e) => handleClientDataChange('concepto_otros_ingresos', e.target.value)}
                      />
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
                      <p className="text-gray-900 mb-4">{displayDefendantData?.nombre_completo}</p>

                      <Label className="text-gray-600">Documento</Label>
                      <p className="text-gray-900 mb-4">{displayDefendantData?.documento}</p>

                      <Label className="text-gray-600">Celular</Label>
                      <p className="text-gray-900">{displayDefendantData?.celular}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Lugar de residencia</Label>
                      <p className="text-gray-900 mb-4">{displayDefendantData?.lugar_residencia}</p>

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
                          value={editedDefendantData?.nombre_completo || ''}
                          onChange={(e) => handleDefendantDataChange('nombre_completo', e.target.value)}
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
                          value={editedDefendantData?.lugar_residencia || ''}
                          onChange={(e) => handleDefendantDataChange('lugar_residencia', e.target.value)}
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