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
      console.log('Caso fetch:', casoFetch);
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


  const initialFormData = {
    // Interview Information
    area: '',

    // Applicant Information
    edad: '',
    contactoFamiliar: '',
    estadoCivil: '',
    estratoSocioeconomico: '',
    direccion: '',
    vivienda: '',

    // Service Request
    servicioSolicita: '',
    nombreRepresentado: '',
    tipoDocumentoRepresentado: '',
    numeroDocumentoRepresentado: '',
    edadRepresentado: '',

    // Employment Information
    tipoTrabajo: '',
    salarioMensual: '',
    valorArriendo: '',
    tieneOtrosIngresos: false,
    valorOtrosIngresos: '',
    conceptoOtrosIngresos: '',

    // Defendant Information
    nombresDemandado: '',
    identificacionDemandado: '',
    residenciaDemandado: '',
    celularDemandado: '',
    correoDemandado: '',

    // Employment Contract Information
    tipoContrato: '',
    nombreRepresentanteLegal: '',
    direccionEmpresa: '',
    correoEmpleador: '',
    fechaInicio: '',
    fechaTerminacion: '',
    continuaContrato: '',
    salarioInicial: '',
    salarioActual: '',

    // Case Information
    hechosRelevantes: '',
    servicioSolicitado: '',
    otrosDatos: '',
    tramiteIniciado: '',
    estadoTramite: '',
    documentosAportados: '',

    // Signatures
    firmasSolicitante: false,
    cedulaSolicitante: ''
  };
  console.log('Initial Form Data:', initialFormData);

  type FormData = typeof initialFormData;

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.area);
      case 2:
        return !!(formData.direccion);
      case 3:
        return !!formData.servicioSolicita;
      case 4:
        return !!formData.tipoTrabajo;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(8)) {
      // Aquí se manejaría el envío del formulario

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
                <Label htmlFor="area">Área</Label>
                <Select value={formData.area} onValueChange={(value: string) => handleInputChange('area', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laboral">Laboral</SelectItem>
                    <SelectItem value="familia">Familia</SelectItem>
                    <SelectItem value="penal">Penal</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombreEntrevistador">Nombre del Entrevistador</Label>
                <Input
                  id="nombreEntrevistador"
                  value={caso?.estudiantes_casos[0]?.estudiante.perfil.nombre_completo || 'No hay entrevistador asignado'}
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
                  value={formData.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="Edad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cedula">C.C. No. *</Label>
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
                  value={formData.contactoFamiliar}
                  onChange={(e) => handleInputChange('contactoFamiliar', e.target.value)}
                  placeholder="Contacto familiar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(value: string) => handleInputChange('estadoCivil', value)}>
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
                <Select value={formData.estratoSocioeconomico} onValueChange={(value: string) => handleInputChange('estratoSocioeconomico', value)}>
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
                <Select value={formData.vivienda} onValueChange={(value: string) => handleInputChange('vivienda', value)}>
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
                <Select value={formData.servicioSolicita} onValueChange={(value: string) => handleInputChange('servicioSolicita', value)}>
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
                <Select value={formData.tipoTrabajo} onValueChange={(value: string) => handleInputChange('tipoTrabajo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione situación laboral" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dependiente">Trabajador Dependiente</SelectItem>
                    <SelectItem value="independiente">Trabajador Independiente</SelectItem>
                    <SelectItem value="sin-empleo">No tiene empleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.tipoTrabajo === 'dependiente' || formData.tipoTrabajo === 'independiente') && (
                <div className="space-y-2">
                  <Label htmlFor="salarioMensual">Salario Mensual</Label>
                  <Input
                    id="salarioMensual"
                    type="number"
                    value={formData.salarioMensual}
                    onChange={(e) => handleInputChange('salarioMensual', e.target.value)}
                    placeholder="Valor en pesos colombianos"
                    required
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tieneOtrosIngresos"
                  checked={formData.tieneOtrosIngresos}
                  onCheckedChange={(checked: boolean) => handleInputChange('tieneOtrosIngresos', checked)}
                />
                <Label htmlFor="tieneOtrosIngresos">
                  Tiene otros ingresos
                </Label>
              </div>

              {formData.tieneOtrosIngresos && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorOtrosIngresos">Valor de Otros Ingresos</Label>
                    <Input
                      id="valorOtrosIngresos"
                      type="number"
                      value={formData.valorOtrosIngresos}
                      onChange={(e) => handleInputChange('valorOtrosIngresos', e.target.value)}
                      placeholder="Valor mensual"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conceptoOtrosIngresos">Por Concepto de</Label>
                    <Input
                      id="conceptoOtrosIngresos"
                      value={formData.conceptoOtrosIngresos}
                      onChange={(e) => handleInputChange('conceptoOtrosIngresos', e.target.value)}
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
                  value={formData.nombresDemandado}
                  onChange={(e) => handleInputChange('nombresDemandado', e.target.value)}
                  placeholder="Nombre completo del demandado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="identificacionDemandado">Identificación del Demandado</Label>
                <Input
                  id="identificacionDemandado"
                  value={formData.identificacionDemandado}
                  onChange={(e) => handleInputChange('identificacionDemandado', e.target.value)}
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
                <Label htmlFor="residenciaDemandado">Lugar de Residencia o Notificación del Demandado</Label>
                <Input
                  id="residenciaDemandado"
                  value={formData.residenciaDemandado}
                  onChange={(e) => handleInputChange('residenciaDemandado', e.target.value)}
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
                  <Select value={formData.continuaContrato} onValueChange={(value: string) => handleInputChange('continuaContrato', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Label htmlFor="hechosRelevantes">Hechos Jurídicamente Relevantes para el Caso</Label>
                <Textarea
                  id="hechosRelevantes"
                  value={formData.hechosRelevantes}
                  onChange={(e) => handleInputChange('hechosRelevantes', e.target.value)}
                  placeholder="Describa los hechos relevantes del caso..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicioSolicitado">Servicio que Solicita</Label>
                <Textarea
                  id="servicioSolicitado"
                  value={formData.servicioSolicitado}
                  onChange={(e) => handleInputChange('servicioSolicitado', e.target.value)}
                  placeholder="Describa el servicio legal que solicita..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otrosDatos">Otros Datos Relevantes</Label>
                <Textarea
                  id="otrosDatos"
                  value={formData.otrosDatos}
                  onChange={(e) => handleInputChange('otrosDatos', e.target.value)}
                  placeholder="Información adicional relevante..."
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