'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, User, MapPin, Briefcase, FileText, Scale, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { ProgressIndicator } from '@radix-ui/react-progress';
import { Caso, Demandado } from 'app/types/database';
import { getCasoById } from '../../../../../../../supabase/queries/getCasoById';
import { getDemandadoByCasoId } from '../../../../../../../supabase/queries/getDemandadoByCasoId';
import { supabase } from '@/utils/supabase';
import { Switch } from '@/components/ui/switch';
import { Tienne } from 'next/font/google';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const STEPS = [
  { id: 1, title: 'Información de la Entrevista', icon: CalendarDays },
  { id: 2, title: 'Información del Solicitante', icon: User },
  { id: 3, title: '¿Quién solicita el servicio?', icon: Scale },
  { id: 4, title: 'Información Laboral y Financiera', icon: Briefcase },
  { id: 5, title: 'Datos del Demandado', icon: MapPin },
  { id: 6, title: 'Información del Contrato Laboral', icon: FileText },
  { id: 7, title: 'Detalles del Caso', icon: FileText },
  { id: 8, title: 'Firmas y Autorización', icon: CheckCircle }
];

export function UserRegistrationForm({ idCaso }: { idCaso: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>();
  async function traerDatos() {
    try {
      setLoading(true);
      setError('');
      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(idCaso),
        getDemandadoByCasoId(idCaso),
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

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const initialFormData = {
    // Interview Information
    area: '',

    // Informacion Solicitante
    edad: '',
    contacto_familiar: '',
    estado_civil: '',
    estrato: '',
    direccion: '',
    tipo_vivienda: '',
    tiene_representado: "",

    // Informacion Financiera
    situacion_laboral: '',
    otros_ingresos: false,
    valor_otros_ingresos: '',
    concepto_otros_ingresos: '',
    tiene_contrato: false,

    // Defendant Information
    nombreDemandado: '',
    documentoDemandado: '',
    celularDemandado: '',
    lugarResidenciaDemandado: '',
    correoDemandado: '',

    // Employment Contract Information
    tipoContrato: '',
    nombreRepresentanteLegal: '',
    direccionEmpresa: '',
    correoEmpleador: '',
    fechaInicio: '',
    fechaTerminacion: '',
    continuaContrato: false,
    salarioInicial: '',
    salarioActual: '',

    // Case Information
    resumen_hechos: '',
    observaciones: '',

    // Signatures
    firmasSolicitante: false,
    cedulaSolicitante: ''
  };

  type FormData = typeof initialFormData;

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // No required fields
      case 2:
        return !!(formData.direccion && formData.edad && formData.estado_civil && formData.estrato && formData.tipo_vivienda);
      case 3:
        return !!formData.tiene_representado;
      case 4:
        return !!formData.situacion_laboral;
      case 5:
        return true; // Optional section
      case 6:
        return true; // Optional section
      case 7:
        return true; // Optional section
      case 8:
        return !!(formData.firmasSolicitante && formData.cedulaSolicitante);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  function cleanFormData(formData: any) {
  const cleaned = { ...formData };

  Object.keys(cleaned).forEach((key) => {
    // Si el valor es una cadena vacía, cámbialo por null
    if (cleaned[key] === '') {
      cleaned[key] = null;
    }
  });

  return cleaned;
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = cleanFormData(formData);
    if (!validateStep(8)) return;

    try {
      console.log("🔄 Enviando formulario...", limpio);

      //Actualizar caso
      const { error: errorCaso } = await supabase
        .from("casos")
        .update({
          area: limpio.area,
          resumen_hechos: limpio.resumen_hechos,
          observaciones: limpio.observaciones,
          estado: "pendiente_aprobacion",
        })
        .eq("id_caso", idCaso);

      if (errorCaso) throw new Error(`Error actualizando caso: ${errorCaso.message}`);

      //Actualizar usuario
      const { error: errorUsuario } = await supabase
        .from("usuarios")
        .update({
          edad: Number(limpio.edad  ),
          contacto_familiar: limpio.contacto_familiar,
          estado_civil: limpio.estado_civil,
          estrato: Number(limpio.estrato),
          direccion: limpio.direccion,
          tipo_vivienda: limpio.tipo_vivienda,
          situacion_laboral: limpio.situacion_laboral,
          otros_ingresos: limpio.otros_ingresos,
          valor_otros_ingresos: Number(limpio.valor_otros_ingresos),
          concepto_otros_ingresos: limpio.concepto_otros_ingresos,
          tiene_contrato: limpio.tiene_contrato,
          tiene_representado: limpio.tiene_representado,
        })
        .eq("id_usuario", caso?.id_usuario);

      if (errorUsuario) throw new Error(`Error actualizando usuario: ${errorUsuario.message}`);

      //Actualizar contrato laboral
      const { error: errorContrato } = await supabase
        .from("contratos_laborales")
        .insert({
          id_usuario: caso?.id_usuario,
          tipo_contrato: limpio.tipoContrato,
          representante_legal: limpio.nombreRepresentanteLegal,
          correo_patrono: limpio.correoEmpleador,
          direccion_empresa: limpio.direccionEmpresa,
          fecha_inicio: limpio.fechaInicio,
          fecha_fin: limpio.fechaTerminacion,
          continua: limpio.continuaContrato,
          salario_inicial: limpio.salarioInicial,
          salario_actual: limpio.salarioActual,
        });

      if (errorContrato) throw new Error(`Error actualizando contrato: ${errorContrato.message}`);

      //Actualizar demandado
      const { error: errorDemandado } = await supabase
        .from("demandados")
        .insert({
          id_caso: idCaso,
          nombre_completo: limpio.nombreDemandado,
          documento: limpio.documentoDemandado,
          celular: limpio.celularDemandado,
          lugar_residencia: limpio.lugarResidenciaDemandado,
          correo: limpio.correoDemandado,
        });

      if (errorDemandado) throw new Error(`Error actualizando demandado: ${errorDemandado.message}`);

      console.log("✅ Formulario enviado correctamente:", limpio);
      clearForm();

    } catch (err) {
      console.error("❌ Error durante la actualización:", err);
      alert(`Ocurrió un error: ${(err as Error).message}`);
    }
  };


  const progress = (currentStep / STEPS.length) * 100;
  const currentStepData = STEPS.find(step => step.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Información de la Entrevista
              </CardTitle>
              <CardDescription>
                Datos básicos de la entrevista legal
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha creación</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={caso?.fecha_creacion || 'No hay fecha asignada'}
                  disabled
                />
              </div>



              <div className="space-y-2">
                <Label htmlFor="nombreEntrevistador">Nombre del Entrevistador</Label>
                <Input
                  id="nombreEntrevistador"
                  value={caso?.estudiantes_casos[caso.estudiantes_casos.length - 1]?.estudiante.perfil.nombre_completo || 'No hay entrevistador asignado'}
                  placeholder="Nombre completo del entrevistador"
                  required
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celularEntrevistador">Número de Celular Entrevistador</Label>
                <Input
                  id="celularEntrevistador"
                  type="tel"
                  value={caso?.estudiantes_casos[0]?.estudiante.perfil.telefono || 'No hay celular asignado'}
                  placeholder="Número de celular"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Solicitante
              </CardTitle>
              <CardDescription>
                Datos personales del solicitante
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombreCompleto">Nombre Completo del Solicitante</Label>
                <Input
                  id="nombreCompleto"
                  value={caso?.usuarios.nombre_completo || ''}
                  placeholder="Nombre completo"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad del Solicitante</Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad || ''}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="Edad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cedula">C.C. No.</Label>
                <Input
                  id="cedula"
                  value={caso?.usuarios.cedula || ''}
                  placeholder="Número de cédula"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Número de Celular o Teléfono</Label>
                <Input
                  id="celular"
                  type="tel"
                  value={caso?.usuarios.telefono || ''}
                  disabled
                  placeholder="Número de contacto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactoFamiliar">Contacto de un Familiar</Label>
                <Input
                  id="contactoFamiliar"
                  value={formData.contacto_familiar}
                  onChange={(e) => handleInputChange('contacto_familiar', e.target.value)}
                  placeholder="Contacto familiar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estado_civil} onValueChange={(value: string) => handleInputChange('estado_civil', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soltero">Soltero(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="union libre">Unión Libre</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estratoSocioeconomico">Estrato Socioeconómico</Label>
                <Select value={formData.estrato} onValueChange={(value: string) => handleInputChange('estrato', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Estrato 1</SelectItem>
                    <SelectItem value="2">Estrato 2</SelectItem>
                    <SelectItem value="3">Estrato 3</SelectItem>
                    <SelectItem value="4">Estrato 4</SelectItem>
                    <SelectItem value="5">Estrato 5</SelectItem>
                    <SelectItem value="6">Estrato 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={caso?.usuarios.correo || ''}
                  placeholder="correo@ejemplo.com"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vivienda">Vivienda</Label>
                <Select value={formData.tipo_vivienda} onValueChange={(value: string) => handleInputChange('tipo_vivienda', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de vivienda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="propia">Propia</SelectItem>
                    <SelectItem value="arrendada">Arrendada</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                ¿Quién solicita el servicio?
              </CardTitle>
              <CardDescription>
                ¿Es solicitante o es representante de otra persona?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="servicioSolicita">Seleccione una opción</Label>
                <Select value={formData.tiene_representado} onValueChange={(value: string) => handleInputChange('tiene_representado', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione quién lo solicita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">A nombre propio</SelectItem>
                    <SelectItem value="false">Representante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Información Laboral y Financiera
              </CardTitle>
              <CardDescription>
                Detalles sobre empleo e ingresos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipoTrabajo">Situación Laboral</Label>
                <Select value={formData.situacion_laboral} onValueChange={(value: string) => handleInputChange('situacion_laboral', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione situación laboral" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dependiente">Trabajador Dependiente</SelectItem>
                    <SelectItem value="independiente">Trabajador Independiente</SelectItem>
                    <SelectItem value="desempleado">No tiene empleo</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tieneOtrosIngresos"
                  checked={formData.otros_ingresos}
                  onCheckedChange={(checked: boolean) => handleInputChange('otros_ingresos', checked)}
                />
                <Label htmlFor="tieneOtrosIngresos">
                  Tiene otros ingresos
                </Label>
              </div>

              {formData.otros_ingresos && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorOtrosIngresos">Valor de Otros Ingresos</Label>
                    <Input
                      id="valorOtrosIngresos"
                      type="number"
                      value={formData.valor_otros_ingresos}
                      onChange={(e) => handleInputChange('valor_otros_ingresos', e.target.value)}
                      placeholder="Valor mensual"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conceptoOtrosIngresos">Por Concepto de</Label>
                    <Input
                      id="conceptoOtrosIngresos"
                      value={formData.concepto_otros_ingresos}
                      onChange={(e) => handleInputChange('concepto_otros_ingresos', e.target.value)}
                      placeholder="Concepto de los ingresos"
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Datos de la Persona a quien Pretende Demandar
              </CardTitle>
              <CardDescription>
                Información del demandado (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombresDemandado">Nombres Completos del Demandado</Label>
                <Input
                  id="nombresDemandado"
                  value={formData.nombreDemandado}
                  onChange={(e) => handleInputChange('nombreDemandado', e.target.value)}
                  placeholder="Nombre completo del demandado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="identificacionDemandado">Identificación del Demandado</Label>
                <Input
                  id="identificacionDemandado"
                  value={formData.documentoDemandado}
                  onChange={(e) => handleInputChange('documentoDemandado', e.target.value)}
                  placeholder="Número de identificación"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="celularDemandado">Número Celular del Demandado</Label>
                <Input
                  id="celularDemandado"
                  type="tel"
                  value={formData.celularDemandado}
                  onChange={(e) => handleInputChange('celularDemandado', e.target.value)}
                  placeholder="Número de celular"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lugarResidenciaDemandado">Lugar de Residencia o Notificación del Demandado</Label>
                <Input
                  id="lugarResidenciaDemandado"
                  value={formData.lugarResidenciaDemandado}
                  onChange={(e) => handleInputChange('lugarResidenciaDemandado', e.target.value)}
                  placeholder="Dirección de residencia"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="correoDemandado">Correo Electrónico del Demandado</Label>
                <Input
                  id="correoDemandado"
                  type="email"
                  value={formData.correoDemandado}
                  onChange={(e) => handleInputChange('correoDemandado', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información del Contrato Laboral
              </CardTitle>
              <CardDescription>
                Detalles del contrato y empleador (opcional)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>¿Tiene Contrato Laboral?</Label>
                <RadioGroup
                  value={formData.tiene_contrato ? "si" : "no"}
                  onValueChange={(value) => handleInputChange('tiene_contrato', value === "si")}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="tieneContratoSi" />
                    <Label htmlFor="tieneContratoSi">Sí</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tieneContratoNo" />
                    <Label htmlFor="tieneContratoNo">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>

            {formData.tiene_contrato && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoContrato">Tipo de Contrato Laboral</Label>
                  <Select value={formData.tipoContrato} onValueChange={(value: string) => handleInputChange('tipoContrato', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escrito">Escrito</SelectItem>
                      <SelectItem value="verbal">Verbal</SelectItem>
                      <SelectItem value="prestacion_servicios">Prestación de Servicios</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreRepresentanteLegal">Nombre del Representante Legal o Patrono</Label>
                    <Input
                      id="nombreRepresentanteLegal"
                      value={formData.nombreRepresentanteLegal}
                      onChange={(e) => handleInputChange('nombreRepresentanteLegal', e.target.value)}
                      placeholder="Nombre del empleador"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correoEmpleador">Correo Electrónico del Empleador</Label>
                    <Input
                      id="correoEmpleador"
                      type="email"
                      value={formData.correoEmpleador}
                      onChange={(e) => handleInputChange('correoEmpleador', e.target.value)}
                      placeholder="correo@empresa.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccionEmpresa">Dirección de la Empresa o Patrono</Label>
                  <Input
                    id="direccionEmpresa"
                    value={formData.direccionEmpresa}
                    onChange={(e) => handleInputChange('direccionEmpresa', e.target.value)}
                    placeholder="Dirección de la empresa"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha de Iniciación del Contrato</Label>
                    <Input
                      id="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaTerminacion">Fecha de Terminación del Contrato</Label>
                    <Input
                      id="fechaTerminacion"
                      type="date"
                      value={formData.fechaTerminacion}
                      onChange={(e) => handleInputChange('fechaTerminacion', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="continuaContrato">¿Continúa el Contrato?</Label>
                    <Checkbox
                      id="continuaContrato"
                      checked={formData.continuaContrato}
                      onCheckedChange={(checked: boolean) => handleInputChange('continuaContrato', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salarioInicial">Salario Inicial</Label>
                    <Input
                      id="salarioInicial"
                      type="number"
                      value={formData.salarioInicial}
                      onChange={(e) => handleInputChange('salarioInicial', e.target.value)}
                      placeholder="Salario al iniciar"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salarioActual">Salario Actual</Label>
                    <Input
                      id="salarioActual"
                      type="number"
                      value={formData.salarioActual}
                      onChange={(e) => handleInputChange('salarioActual', e.target.value)}
                      placeholder="Salario actual"
                    />
                  </div>
                </div>
              </CardContent>
            )}

          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles del Caso
              </CardTitle>
              <CardDescription>
                Información adicional sobre el caso legal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
                <Select value={formData.area} onValueChange={(value: string) => handleInputChange('area', value)}>
                  <SelectTrigger >
                    <SelectValue placeholder="Seleccione el área" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="laboral">Laboral</SelectItem>
                    <SelectItem value="familia">Familia</SelectItem>
                    <SelectItem value="penal">Penal</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumen_hechos">Hechos Jurídicamente Relevantes para el Caso</Label>
                <Textarea
                  id="resumen_hechos"
                  value={formData.resumen_hechos}
                  onChange={(e) => handleInputChange('resumen_hechos', e.target.value)}
                  placeholder="Describa los hechos relevantes del caso..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Describa el servicio legal que solicita..."
                  rows={3}
                />
              </div>


            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Firmas y Autorización
              </CardTitle>
              <CardDescription>
                Confirmación y firma del solicitante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label htmlFor="cedulaSolicitante">C.C. del Solicitante para Firma *</Label>
                <Input
                  id="cedulaSolicitante"
                  value={formData.cedulaSolicitante}
                  onChange={(e) => handleInputChange('cedulaSolicitante', e.target.value)}
                  placeholder="Número de cédula para confirmación"
                  required
                />
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="firmasSolicitante"
                  checked={formData.firmasSolicitante}
                  onCheckedChange={(checked: boolean) => handleInputChange('firmasSolicitante', checked)}
                  required
                />
                <Label htmlFor="firmasSolicitante" className="text-sm">
                  Confirmo que toda la información proporcionada es veraz y autorizo el procesamiento de estos datos para los fines legales correspondientes *
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Paso {currentStep} de {STEPS.length}
          </h3>
          <span className="text-sm text-blue-800">
            {Math.round(progress)}% completado
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-blue-100 ">
          <ProgressIndicator className="bg-blue-600" />
        </Progress>

        {/* Step Title */}
        {currentStepData && (
          <div className="flex items-center gap-2 mt-4">
            <currentStepData.icon className="h-5 w-5 text-blue-600" />
            <h4 className="text-base font-medium text-gray-800">
              {currentStepData.title}
            </h4>
          </div>
        )}
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">

          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
          )}



          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!validateStep(8)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Enviar Formulario
            </Button>
          )}
        </div>
      </form>

      {/* Step Indicators */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {STEPS.map((step) => (
            <button
              //disabled={step.id > currentStep}
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              //disabled={step.id > currentStep}
              className={`w-3 h-3 rounded-full transition-colors ${step.id === currentStep
                ? 'bg-blue-600'
                : step.id < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
                }`}
              aria-label={`Ir al paso ${step.id}: ${step.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}