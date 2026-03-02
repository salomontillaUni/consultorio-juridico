"use client";
import { useEffect, useState } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "app/pro-apoyo/components/NavBarProApoyo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Caso, Demandado, Estudiante, Usuario } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { formatDate } from "../page";
import { cleanData } from "@/utils/utils";
import { supabase } from "@/utils/supabase/supabase";
import {
  Notebook,
  FileText,
  Edit3,
  Check,
  Briefcase,
  Activity,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Users,
  Calendar,
  UserX,
  Mail,
  Phone,
  MapPin,
  IdCard,
  User,
  Heart,
  DollarSign,
  BriefcaseIcon,
  Smile,
} from "lucide-react";
import { getStatusBadge } from "app/asesor/mis-casos/page";
import { ReasignarEquipo } from "./components/ReasignarEquipo";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: Promise<{ id_caso: string }>;
}) {
  const { id_caso } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editedStudentData, setEditedStudentData] = useState<
    Estudiante[] | null
  >(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(
    null,
  );
  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] =
    useState<Demandado | null>(null);
  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState<string>("");
  const [newNote, setNewNote] = useState("");
  const [caso, setCaso] = useState<Caso>();

  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [id_caso]);

  const handleStudentDataChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    if (editedStudentData) {
      const updatedData = [...editedStudentData];
      const fieldParts = field.split(".");

      if (fieldParts.length === 2 && fieldParts[0] === "perfil") {
        updatedData[index] = {
          ...updatedData[index],
          perfil: {
            ...updatedData[index].perfil,
            [fieldParts[1]]: value,
          },
        };
      } else {
        updatedData[index] = {
          ...updatedData[index],
          [field]: value,
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

  const handleSaveClient = async () => {
    if (editedClientData) {
      setIsEditingClient(false);
      setEditedClientData(null);
      const limpio = cleanData(editedClientData);
      try {
        const { error: errorCaso } = await supabase
          .from("usuarios")
          .update({
            nombre_completo: limpio.nombre_completo,
            sexo: limpio.sexo,
            cedula: limpio.cedula,
            edad: limpio.edad,
            estado_civil: limpio.estado_civil,
            estrato: limpio.estrato,
            telefono: limpio.telefono,
            contacto_familiar: limpio.contacto_familiar,
            correo: limpio.correo,
            tipo_vivienda: limpio.tipo_vivienda,
            direccion: limpio.direccion,
            situacion_laboral: limpio.situacion_laboral,
            valor_otros_ingresos: limpio.valor_otros_ingresos,
            otros_ingresos: limpio.otros_ingresos,
            concepto_otros_ingresos: limpio.concepto_otros_ingresos,
          })
          .eq("id_usuario", caso?.id_usuario);
        console.log("🔄 Actualizando usuario...", limpio);
        if (errorCaso) {
          setError(errorCaso.message);
          throw errorCaso;
        }
        await traerDatos();
        toast.success("Información del cliente actualizada");
      } catch (err) {
        console.error(err);
        setError("Error al guardar los datos del usuario");
      }
    }
  };

  const handleCancelClientEdit = () => {
    setIsEditingClient(false);
    setEditedClientData(null);
  };

  const handleClientDataChange = (
    field: keyof Usuario,
    value: string | boolean,
  ) => {
    if (editedClientData) {
      setEditedClientData({
        ...editedClientData,
        [field]: value,
      });
    }
  };

  // Defendant editing functions
  const handleEditDefendant = () => {
    setEditedDefendantData(demandado || null);
    setIsEditingDefendant(true);
  };

  const handleSaveDefendant = async () => {
    if (editedDefendantData) {
      setIsEditingDefendant(false);
      setEditedDefendantData(null);
      const limpio = cleanData(editedDefendantData);
      console.log("ID_CASO ENVIADO AL UPDATE:", id_caso, typeof id_caso);

      try {
        const { data, error } = await supabase
          .from("demandados")
          .update({
            nombre_completo: limpio.nombre_completo,
            lugar_residencia: limpio.lugar_residencia,
            documento: limpio.documento,
            correo: limpio.correo,
            celular: limpio.celular,
          })
          .eq("id_caso", id_caso)
          .select();

        console.log("DATA:", data);
        console.log("ERROR:", error);
        if (error) {
          setError(error.message);
          throw error;
        }
        await traerDatos();
        toast.success("Información del demandado actualizada");
      } catch (err) {
        console.error(err);
        setError("Error al guardar los datos del demandado");
      }
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
        [field]: value,
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

  const handleSaveCaseInfo = async () => {
    if (editedCaseData) {
      setIsEditingCaseInfo(false);
      setEditedCaseData(null);
      const limpio = cleanData(editedCaseData);
      try {
        const { error: errorCaso } = await supabase
          .from("casos")
          .update({
            area: limpio.area,
            aprobacion_asesor: limpio.aprobacion_asesor,
            tipo_proceso: limpio.tipo_proceso,
            resumen_hechos: limpio.resumen_hechos,
            estado: limpio.estado,
            observaciones: limpio.observaciones,
          })
          .eq("id_caso", id_caso);
        console.log("🔄 Actualizando caso...", limpio);
        if (errorCaso) {
          setError(errorCaso.message);
          throw errorCaso;
        }
        await traerDatos();
        toast.success("Información del caso actualizada");
      } catch (err) {
        console.error(err);
        setError("Error al guardar los datos del caso");
      }
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
        [field]: value,
      });
    }
  };

  // Notes editing functions
  const handleEditNotes = () => {
    setEditedNotes(caso?.observaciones || "");
    setNewNote("");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    setEditedNotes("");
    setNewNote("");
  };

  const handleCancelNotesEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes("");
    setNewNote("");
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setEditedNotes(editedNotes + "\n" + newNote);
      setNewNote("");
    }
  };

  const handleEditNote = (index: number, value: string) => {
    const updatedNotes = [...editedNotes.split("\n")];
    updatedNotes[index] = value;
    setEditedNotes(updatedNotes.join("\n"));
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = editedNotes.split("\n").filter((_, i) => i !== index);
    setEditedNotes(updatedNotes.join("\n"));
  };
  const displayStudentData = isEditingStudent
    ? editedStudentData
    : caso?.estudiantes_casos.map((ec) => ec.estudiante);
  const displayClientData = isEditingClient ? editedClientData : caso?.usuarios;
  const displayDefendantData = isEditingDefendant
    ? editedDefendantData
    : demandado;
  const displayCaseData = isEditingCaseInfo ? editedCaseData : caso;
  const displayNotes = isEditingNotes ? editedNotes : caso?.observaciones || "";

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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a supervisión de casos
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {caso?.id_caso}
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {caso && getStatusBadge(caso?.estado)}
                  </div>
                </div>
                <p className="text-lg text-slate-500 font-medium">
                  {caso?.usuarios.nombre_completo}
                </p>
                <div className="flex items-center mt-4 p-2 px-3 bg-blue-50/50 rounded-lg w-fit">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mr-3">
                    Estudiante asignado:
                  </span>
                  <span className="text-sm font-semibold text-blue-700">
                    {caso?.estudiantes_casos &&
                    caso.estudiantes_casos.length > 0
                      ? caso.estudiantes_casos[
                          caso.estudiantes_casos.length - 1
                        ].estudiante.perfil.nombre_completo
                      : "Sin asignar"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className={`grid w-full grid-cols-2 lg:grid-cols-${displayCaseData?.estudiantes_casos.length ? "4" : "3"}`}
            >
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
                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 tracking-tight">
                          Información del caso
                        </h3>
                      </div>
                      {!isEditingCaseInfo ? (
                        <Button
                          onClick={handleEditCaseInfo}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modificar
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveCaseInfo}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Guardar
                          </Button>
                          <Button
                            onClick={handleCancelCaseEdit}
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:bg-slate-100 font-semibold"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {!isEditingCaseInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <div className="space-y-1">
                            <div className="flex items-center text-slate-500 mb-1">
                              <Briefcase className="w-4 h-4 mr-2 opacity-70" />
                              <Label className="text-xs font-bold uppercase tracking-wider">
                                Tipo de caso
                              </Label>
                            </div>
                            <p className="text-slate-900 font-semibold capitalize pl-6 text-lg">
                              {displayCaseData?.area || "No definido"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-slate-500 mb-1">
                              <Activity className="w-4 h-4 mr-2 opacity-70" />
                              <Label className="text-xs font-bold uppercase tracking-wider">
                                Estado del caso
                              </Label>
                            </div>
                            <div className="pl-6 pt-1">
                              {caso && getStatusBadge(caso.estado)}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-slate-500 mb-1">
                              <ClipboardList className="w-4 h-4 mr-2 opacity-70" />
                              <Label className="text-xs font-bold uppercase tracking-wider">
                                Tipo de proceso
                              </Label>
                            </div>
                            <p className="text-slate-900 font-medium pl-6">
                              {displayCaseData?.tipo_proceso ||
                                "Sin especificar"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-slate-500 mb-1">
                              <ShieldCheck className="w-4 h-4 mr-2 opacity-70" />
                              <Label className="text-xs font-bold uppercase tracking-wider">
                                Aprobación Asesor
                              </Label>
                            </div>
                            <div className="pl-6 pt-1">
                              {displayCaseData?.aprobacion_asesor ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-bold">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  APROBADO
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="border-slate-200 text-slate-400 font-bold px-3 py-1 uppercase"
                                >
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <Label className="text-slate-700 font-bold flex items-center gap-2 mb-1">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                Tipo de caso
                              </Label>
                              <Select
                                value={editedCaseData?.area || ""}
                                onValueChange={(value) =>
                                  handleCaseDataChange("area", value)
                                }
                              >
                                <SelectTrigger className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11">
                                  <SelectValue placeholder="Seleccionar tipo de caso" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                  <SelectItem
                                    value="laboral"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Laboral
                                  </SelectItem>
                                  <SelectItem
                                    value="civil"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Civil
                                  </SelectItem>
                                  <SelectItem
                                    value="penal"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Penal
                                  </SelectItem>
                                  <SelectItem
                                    value="familia"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Familia
                                  </SelectItem>
                                  <SelectItem
                                    value="otros"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Otros
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-700 font-bold flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-4 h-4 text-slate-400" />
                                Estado de aprobación
                              </Label>
                              <Select
                                value={
                                  editedCaseData?.aprobacion_asesor
                                    ? "true"
                                    : "false"
                                }
                                onValueChange={(value) =>
                                  handleCaseDataChange(
                                    "aprobacion_asesor",
                                    value === "true",
                                  )
                                }
                              >
                                <SelectTrigger className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11">
                                  <SelectValue placeholder="Estado de aprobación" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                  <SelectItem
                                    value="true"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Aprobado por asesor
                                  </SelectItem>
                                  <SelectItem
                                    value="false"
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    Pendiente de revisión
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="space-y-2">
                              <Label className="text-slate-700 font-bold flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4 text-slate-400" />
                                Estado del caso
                              </Label>
                              <Select
                                value={editedCaseData?.estado || ""}
                                onValueChange={(value) =>
                                  handleCaseDataChange("estado", value)
                                }
                              >
                                <SelectTrigger className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11">
                                  <SelectValue placeholder="Cambiar estado" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                  <SelectItem value="pendiente_aprobacion">
                                    Pendiente de aprobación
                                  </SelectItem>
                                  <SelectItem value="aprobado">
                                    Aprobado
                                  </SelectItem>
                                  <SelectItem value="en_proceso">
                                    En proceso
                                  </SelectItem>
                                  <SelectItem value="cerrado">
                                    Cerrado
                                  </SelectItem>
                                  <SelectItem value="archivado">
                                    Archivado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-slate-700 font-bold flex items-center gap-2 mb-1">
                                <ClipboardList className="w-4 h-4 text-slate-400" />
                                Tipo de proceso
                              </Label>
                              <Input
                                value={editedCaseData?.tipo_proceso || ""}
                                onChange={(e) =>
                                  handleCaseDataChange(
                                    "tipo_proceso",
                                    e.target.value,
                                  )
                                }
                                className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11"
                                placeholder={
                                  displayCaseData?.tipo_proceso ||
                                  "Ej: Radicado legal..."
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <Notebook className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Resumen de los hechos</h3>
                    </div>

                    <div className="p-6">
                      {!isEditingCaseInfo ? (
                        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-60" />
                          {displayCaseData?.resumen_hechos ? (
                            <p className="text-slate-700 leading-relaxed pl-3 whitespace-pre-wrap">
                              {displayCaseData?.resumen_hechos}
                            </p>
                          ) : (
                            <p className="text-sm text-center text-slate-500 italic py-4">
                              No hay resumen de los hechos registrado
                            </p>
                          )}
                        </div>
                      ) : (
                        <Textarea
                          value={editedCaseData?.resumen_hechos || ""}
                          onChange={(e) =>
                            handleCaseDataChange("resumen_hechos", e.target.value)
                          }
                          placeholder="Descripción detallada de los hechos del caso..."
                          className="min-h-48 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl leading-relaxed"
                        />
                      )}
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Observaciones</h3>
                    </div>

                    <div className="p-6">
                      {!isEditingCaseInfo ? (
                        <div className="space-y-4">
                          {displayNotes ? (
                            displayNotes
                              .split("\n")
                              .filter(note => note.trim() !== "")
                              .map((note: string, index: number) => (
                                <div
                                  key={index}
                                  className="p-5 bg-white rounded-xl border border-slate-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-all"
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 opacity-60" />
                                  <p className="text-slate-700 leading-relaxed pl-3 whitespace-pre-wrap">
                                    {note}
                                  </p>
                                </div>
                              ))
                          ) : (
                            <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                              <p className="text-slate-400 text-sm italic">
                                No hay observaciones registradas
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Textarea
                            value={editedCaseData?.observaciones || ""}
                            onChange={(e) =>
                              handleCaseDataChange(
                                "observaciones",
                                e.target.value,
                              )
                            }
                            placeholder="Escribir observaciones importantes sobre el seguimiento del caso..."
                            className="min-h-48 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Fechas importantes</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 block">Fecha de creación</Label>
                        {caso && (
                          <div className="flex items-center gap-2 text-slate-900 font-medium">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            {formatDate(caso.fecha_creacion)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Equipo asignado</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <ReasignarEquipo
                        idCaso={id_caso}
                        type="estudiante"
                        casosData={displayCaseData?.estudiantes_casos || []}
                        onRefresh={traerDatos}
                      />
                      <div className="border-t border-slate-100 pt-6">
                        <ReasignarEquipo
                          idCaso={id_caso}
                          type="asesor"
                          casosData={displayCaseData?.asesores_casos || []}
                          onRefresh={traerDatos}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Student Data Tab */}
            <TabsContent value="supervision" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {displayStudentData?.map((student, index) => (
                  <Card key={student.id_perfil || index} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-gray-900 font-semibold">
                          Estudiante{" "}
                          {displayStudentData.length > 1 ? index + 1 : ""}
                        </h3>
                      </div>
                    </div>

                    {!isEditingStudent ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-gray-600">
                            Nombre completo
                          </Label>
                          <p className="text-gray-900 font-medium">
                            {student.perfil.nombre_completo}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Cédula</Label>
                          <p className="text-gray-900">
                            {student.perfil.cedula}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600">
                            Correo electrónico
                          </Label>
                          <p className="text-blue-600">
                            {student.perfil.correo}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Semestre</Label>
                          <p className="text-gray-900">{student.semestre}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Jornada</Label>
                          <p className="text-gray-900">{student.jornada}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Turno</Label>
                          <p className="text-gray-900">{student.turno}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Teléfono</Label>
                          <p className="text-gray-900">
                            {student.perfil.telefono || "No registrado"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-gray-600">
                            Nombre completo
                          </Label>
                          <Input
                            value={student.perfil.nombre_completo || ""}
                            onChange={(e) =>
                              handleStudentDataChange(
                                index,
                                "perfil.nombre_completo",
                                e.target.value,
                              )
                            }
                            placeholder="Nombre completo"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-600">Cédula</Label>
                          <Input
                            value={student.perfil.cedula || ""}
                            onChange={(e) =>
                              handleStudentDataChange(
                                index,
                                "perfil.cedula",
                                e.target.value,
                              )
                            }
                            placeholder="Cédula"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-600">
                            Correo electrónico
                          </Label>
                          <Input
                            type="email"
                            value={student.perfil.correo || ""}
                            onChange={(e) =>
                              handleStudentDataChange(
                                index,
                                "perfil.correo",
                                e.target.value,
                              )
                            }
                            placeholder="correo@estudiantes.edu.co"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-600">Semestre</Label>
                          <Select
                            value={student.semestre?.toString()}
                            onValueChange={(value) =>
                              handleStudentDataChange(index, "semestre", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Semestre" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(10)].map((_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-600">Jornada</Label>
                          <Select
                            value={student.jornada || ""}
                            onValueChange={(value) =>
                              handleStudentDataChange(index, "jornada", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Jornada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="diurna">Diurna</SelectItem>
                              <SelectItem value="nocturna">Nocturna</SelectItem>
                              <SelectItem value="mixto">Mixto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-600">Turno</Label>
                          <Select
                            value={student.turno || ""}
                            onValueChange={(value) =>
                              handleStudentDataChange(index, "turno", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Turno" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9-11">9-11</SelectItem>
                              <SelectItem value="2-4">2-4</SelectItem>
                              <SelectItem value="4-6">4-6</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-600">Teléfono</Label>
                          <Input
                            value={student.perfil.telefono || ""}
                            onChange={(e) =>
                              handleStudentDataChange(
                                index,
                                "perfil.telefono",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                {(!displayStudentData || displayStudentData.length === 0) && (
                  <Card className="p-12 text-center">
                    <p className="text-gray-500 italic">
                      No hay estudiantes asignados a este caso.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-6">
              {/* Personal Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
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
                      <p className="text-gray-900">
                        {caso?.usuarios.nombre_completo}
                      </p>
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
                      <p className="text-gray-900">
                        {caso?.usuarios.edad} años
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado civil</Label>
                      <p className="text-gray-900">
                        {caso?.usuarios.estado_civil}
                      </p>
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
                        value={editedClientData?.nombre_completo || ""}
                        onChange={(e) =>
                          handleClientDataChange(
                            "nombre_completo",
                            e.target.value,
                          )
                        }
                        placeholder="Nombre completo del cliente"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Sexo</Label>
                      <Select
                        value={editedClientData?.sexo}
                        onValueChange={(value) =>
                          handleClientDataChange("sexo", value)
                        }
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
                        value={editedClientData?.cedula || ""}
                        onChange={(e) =>
                          handleClientDataChange("cedula", e.target.value)
                        }
                        placeholder="Número de cédula"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Edad</Label>
                      <Input
                        type="number"
                        value={editedClientData?.edad || ""}
                        onChange={(e) =>
                          handleClientDataChange("edad", e.target.value)
                        }
                        placeholder="Edad en años"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Estado civil</Label>
                      <Select
                        value={editedClientData?.estado_civil || ""}
                        onValueChange={(value) =>
                          handleClientDataChange("estado_civil", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soltero">Soltero</SelectItem>
                          <SelectItem value="casado">Casado</SelectItem>
                          <SelectItem value="union libre">
                            Union Libre
                          </SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">Estrato</Label>
                      <Select
                        value={editedClientData?.estrato?.toString()}
                        onValueChange={(value) =>
                          handleClientDataChange("estrato", value)
                        }
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
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">Información de contacto</h3>
                </div>
                {!isEditingClient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Teléfono</Label>
                      <p className="text-gray-900 mb-4">
                        {caso?.usuarios.telefono}
                      </p>

                      <Label className="text-gray-600">
                        Correo electrónico
                      </Label>
                      <p className="text-gray-900 mb-4">
                        {caso?.usuarios.correo}
                      </p>

                      <Label className="text-gray-600">Dirección</Label>
                      <p className="text-gray-900">
                        {caso?.usuarios.direccion}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">
                        Contacto de familiar
                      </Label>
                      <p className="text-gray-900 mb-4">
                        {caso?.usuarios.contacto_familiar}
                      </p>

                      <Label className="text-gray-600">Tipo de vivienda</Label>
                      <p className="text-gray-900 mb-4">
                        {caso?.usuarios.tipo_vivienda}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Teléfono</Label>
                      <Input
                        value={editedClientData?.telefono || ""}
                        onChange={(e) =>
                          handleClientDataChange("telefono", e.target.value)
                        }
                        placeholder="Número de teléfono"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">
                        Contacto de familiar
                      </Label>
                      <Input
                        value={editedClientData?.contacto_familiar || ""}
                        onChange={(e) =>
                          handleClientDataChange(
                            "contacto_familiar",
                            e.target.value,
                          )
                        }
                        placeholder="Contacto de un familiar"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">
                        Correo electrónico
                      </Label>
                      <Input
                        value={editedClientData?.correo || ""}
                        onChange={(e) =>
                          handleClientDataChange("correo", e.target.value)
                        }
                        placeholder="Correo electrónico"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Tipo de vivienda</Label>
                      <Input
                        value={editedClientData?.tipo_vivienda || ""}
                        onChange={(e) =>
                          handleClientDataChange(
                            "tipo_vivienda",
                            e.target.value,
                          )
                        }
                        placeholder="Tipo de vivienda"
                        className="mb-4"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Dirección</Label>
                      <Input
                        value={editedClientData?.direccion || ""}
                        onChange={(e) =>
                          handleClientDataChange("direccion", e.target.value)
                        }
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
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-gray-900">
                    Información laboral y financiera
                  </h3>
                </div>
                {!isEditingClient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Situación laboral</Label>
                      <p className="text-gray-900 mb-4">
                        {caso?.usuarios.situacion_laboral}
                      </p>

                      <Label className="text-gray-600">Otros ingresos</Label>
                      {caso?.usuarios.otros_ingresos ? (
                        <p className="text-gray-900 mb-4">Sí</p>
                      ) : (
                        <p className="text-gray-900 mb-4">No</p>
                      )}
                    </div>

                    {caso?.usuarios.otros_ingresos && (
                      <div>
                        <Label className="text-gray-600">
                          Valor de otros ingresos
                        </Label>
                        <p className="text-gray-900 mb-4">
                          {caso?.usuarios.valor_otros_ingresos}
                        </p>

                        <Label className="text-gray-600">
                          Concepto de otros ingresos
                        </Label>
                        <p className="text-gray-900">
                          {caso?.usuarios.concepto_otros_ingresos}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">Situación laboral</Label>
                      <Select
                        value={editedClientData?.situacion_laboral?.toString()}
                        onValueChange={(value) =>
                          handleClientDataChange("situacion_laboral", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar situación laboral" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dependiente">
                            Dependiente
                          </SelectItem>
                          <SelectItem value="desempleado">
                            Desempleado
                          </SelectItem>
                          <SelectItem value="independiente">
                            Independiente
                          </SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-600">
                        Valor de otros ingresos
                      </Label>
                      <Input
                        type="text"
                        value={editedClientData?.valor_otros_ingresos || ""}
                        onChange={(e) =>
                          handleClientDataChange(
                            "valor_otros_ingresos",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Otros ingresos</Label>
                      <Select
                        value={String(editedClientData?.otros_ingresos)}
                        onValueChange={(value) =>
                          handleClientDataChange(
                            "otros_ingresos",
                            value === "true",
                          )
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
                      <Label className="text-gray-600">
                        Concepto de otros ingresos
                      </Label>
                      <Input
                        type="text"
                        value={editedClientData?.concepto_otros_ingresos || ""}
                        onChange={(e) =>
                          handleClientDataChange(
                            "concepto_otros_ingresos",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Defendant Tab */}
            <TabsContent value="defendant" className="space-y-6">
              <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                      <UserX className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 tracking-tight">Información del demandado</h3>
                  </div>
                  {!isEditingDefendant ? (
                    <Button
                      onClick={handleEditDefendant}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Modificar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveDefendant}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancelDefendantEdit}
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:bg-slate-100 font-semibold"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {!isEditingDefendant ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-500 mb-1">
                            <UserX className="w-4 h-4 mr-2 opacity-70" />
                            <Label className="text-xs font-bold uppercase tracking-wider">Nombre completo</Label>
                          </div>
                          <p className="text-slate-900 font-semibold pl-6 text-lg">
                            {displayDefendantData?.nombre_completo || "No registrado"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-slate-500 mb-1">
                            <IdCard className="w-4 h-4 mr-2 opacity-70" />
                            <Label className="text-xs font-bold uppercase tracking-wider">Documento / NIT</Label>
                          </div>
                          <p className="text-slate-700 font-medium pl-6">
                            {displayDefendantData?.documento || "Sin documento"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-slate-500 mb-1">
                            <Phone className="w-4 h-4 mr-2 opacity-70" />
                            <Label className="text-xs font-bold uppercase tracking-wider">Celular</Label>
                          </div>
                          <p className="text-slate-700 font-medium pl-6">
                            {displayDefendantData?.celular || "No disponible"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-500 mb-1">
                            <MapPin className="w-4 h-4 mr-2 opacity-70" />
                            <Label className="text-xs font-bold uppercase tracking-wider">Lugar de residencia</Label>
                          </div>
                          <p className="text-slate-700 font-medium pl-6 leading-relaxed">
                            {displayDefendantData?.lugar_residencia || "Dirección no registrada"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-slate-500 mb-1">
                            <Mail className="w-4 h-4 mr-2 opacity-70" />
                            <Label className="text-xs font-bold uppercase tracking-wider">Correo electrónico</Label>
                          </div>
                          <p className="text-blue-600 font-medium pl-6 break-all">
                            {displayDefendantData?.correo || "Sin correo"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold flex items-center gap-2">
                            <UserX className="w-4 h-4 text-slate-400" />
                            Nombre completo
                          </Label>
                          <Input
                            value={editedDefendantData?.nombre_completo || ""}
                            onChange={(e) =>
                              handleDefendantDataChange(
                                "nombre_completo",
                                e.target.value,
                              )
                            }
                            placeholder="Nombre o razón social"
                            className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold flex items-center gap-2">
                            <IdCard className="w-4 h-4 text-slate-400" />
                            Documento
                          </Label>
                          <Input
                            value={editedDefendantData?.documento || ""}
                            onChange={(e) =>
                              handleDefendantDataChange(
                                "documento",
                                e.target.value,
                              )
                            }
                            placeholder="NIT, CC, etc."
                            className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            Celular
                          </Label>
                          <Input
                            value={editedDefendantData?.celular || ""}
                            onChange={(e) =>
                              handleDefendantDataChange("celular", e.target.value)
                            }
                            placeholder="+57 321 ..."
                            className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Lugar de residencia
                          </Label>
                          <Textarea
                            value={editedDefendantData?.lugar_residencia || ""}
                            onChange={(e) =>
                              handleDefendantDataChange(
                                "lugar_residencia",
                                e.target.value,
                              )
                            }
                            placeholder="Dirección completa"
                            className="min-h-24 border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            Correo electrónico
                          </Label>
                          <Input
                            type="email"
                            value={editedDefendantData?.correo || ""}
                            onChange={(e) =>
                              handleDefendantDataChange("correo", e.target.value)
                            }
                            placeholder="correo@ejemplo.com"
                            className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
