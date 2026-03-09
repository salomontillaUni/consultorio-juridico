import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  User,
  MapPin,
  Briefcase,
  FileText,
  Scale,
  CheckCircle,
} from "lucide-react";
import { Caso } from "app/types/database";

export interface StepProps {
  formData: any;
  handleInputChange: (field: any, value: any) => void;
  caso?: Caso;
  currentUserId?: string | null;
}

export function Step1InfoEntrevista({ caso, currentUserId }: StepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Información de la Entrevista
        </CardTitle>
        <CardDescription>Datos básicos de la entrevista legal</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha creación</Label>
          <Input
            id="fecha"
            type="date"
            value={
              caso?.fecha_creacion
                ? new Date(caso.fecha_creacion).toISOString().split("T")[0]
                : "No hay fecha asignada"
            }
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombreEntrevistador">Nombre del Entrevistador</Label>
          <Input
            id="nombreEntrevistador"
            value={
              caso?.estudiantes_casos?.[0]?.estudiante?.perfil
                ?.nombre_completo || "No hay entrevistador asignado"
            }
            placeholder="Nombre completo del entrevistador"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celularEntrevistador">
            Número de Celular Entrevistador
          </Label>
          <Input
            id="celularEntrevistador"
            type="tel"
            value={
              caso?.estudiantes_casos?.find(
                (ec) => ec.estudiante?.id_perfil === currentUserId,
              )?.estudiante?.perfil?.telefono ||
              caso?.estudiantes_casos?.[0]?.estudiante?.perfil?.telefono ||
              "No hay celular asignado"
            }
            placeholder="Número de celular"
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function Step2InfoSolicitante({
  formData,
  handleInputChange,
  caso,
}: StepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Solicitante
        </CardTitle>
        <CardDescription>Datos personales del solicitante</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nombreCompleto">
            Nombre Completo del Solicitante
          </Label>
          <Input
            id="nombreCompleto"
            value={caso?.usuarios.nombre_completo || ""}
            placeholder="Nombre completo"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edad">Edad del Solicitante *</Label>
          <Input
            id="edad"
            type="number"
            value={formData.edad || ""}
            onChange={(e) => handleInputChange("edad", e.target.value)}
            placeholder="Edad"
            className="bg-white/50 focus:bg-white transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cedula">C.C. No.</Label>
          <Input
            id="cedula"
            value={caso?.usuarios.cedula || ""}
            placeholder="Número de cédula"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celular">Número de Celular o Teléfono</Label>
          <Input
            id="celular"
            type="tel"
            value={caso?.usuarios.telefono || ""}
            disabled
            placeholder="Número de contacto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactoFamiliar">Contacto de un Familiar</Label>
          <Input
            id="contactoFamiliar"
            value={formData.contacto_familiar}
            onChange={(e) =>
              handleInputChange("contacto_familiar", e.target.value)
            }
            placeholder="Contacto familiar"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estadoCivil">Estado Civil *</Label>
          <Select
            value={formData.estado_civil}
            onValueChange={(value) => handleInputChange("estado_civil", value)}
          >
            <SelectTrigger className="bg-white/50 focus:bg-white transition-colors">
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
          <Label htmlFor="estratoSocioeconomico">
            Estrato Socioeconómico *
          </Label>
          <Select
            value={formData.estrato}
            onValueChange={(value) => handleInputChange("estrato", value)}
          >
            <SelectTrigger className="bg-white/50 focus:bg-white transition-colors">
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
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
            placeholder="Dirección completa"
            className="bg-white/50 focus:bg-white transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="correo">Correo Electrónico</Label>
          <Input
            id="correo"
            type="email"
            value={caso?.usuarios.correo || ""}
            placeholder="correo@ejemplo.com"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vivienda">Vivienda *</Label>
          <Select
            value={formData.tipo_vivienda}
            onValueChange={(value) => handleInputChange("tipo_vivienda", value)}
          >
            <SelectTrigger className="bg-white/50 focus:bg-white transition-colors">
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
}

export function Step3QuienSolicita({ formData, handleInputChange }: StepProps) {
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
          <Label htmlFor="servicioSolicita">Seleccione una opción *</Label>
          <Select
            value={formData.tiene_representado}
            onValueChange={(value) =>
              handleInputChange("tiene_representado", value)
            }
          >
            <SelectTrigger className="bg-white/50 focus:bg-white transition-colors">
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
}

export function Step4InfoLaboral({ formData, handleInputChange }: StepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Información Laboral y Financiera
        </CardTitle>
        <CardDescription>Detalles sobre empleo e ingresos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tipoTrabajo">Situación Laboral *</Label>
          <Select
            value={formData.situacion_laboral}
            onValueChange={(value) =>
              handleInputChange("situacion_laboral", value)
            }
          >
            <SelectTrigger className="bg-white/50 focus:bg-white transition-colors">
              <SelectValue placeholder="Seleccione situación laboral" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dependiente">
                Trabajador Dependiente
              </SelectItem>
              <SelectItem value="independiente">
                Trabajador Independiente
              </SelectItem>
              <SelectItem value="desempleado">No tiene empleo</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tieneOtrosIngresos"
            checked={formData.otros_ingresos}
            onCheckedChange={(checked: boolean) =>
              handleInputChange("otros_ingresos", checked)
            }
          />
          <Label htmlFor="tieneOtrosIngresos">Tiene otros ingresos</Label>
        </div>
        {formData.otros_ingresos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorOtrosIngresos">
                Valor de Otros Ingresos
              </Label>
              <Input
                id="valorOtrosIngresos"
                type="number"
                value={formData.valor_otros_ingresos}
                onChange={(e) =>
                  handleInputChange("valor_otros_ingresos", e.target.value)
                }
                placeholder="Valor mensual"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conceptoOtrosIngresos">Por Concepto de</Label>
              <Input
                id="conceptoOtrosIngresos"
                value={formData.concepto_otros_ingresos}
                onChange={(e) =>
                  handleInputChange("concepto_otros_ingresos", e.target.value)
                }
                placeholder="Concepto de los ingresos"
                required
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Step5DatosAccionado({
  formData,
  handleInputChange,
}: StepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Datos del accionado
        </CardTitle>
        <CardDescription>Información del Accionado</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nombresDemandado">
            Nombres Completos del Accionado *
          </Label>
          <Input
            id="nombresDemandado"
            required
            value={formData.nombreDemandado}
            onChange={(e) =>
              handleInputChange("nombreDemandado", e.target.value)
            }
            placeholder="Nombre completo del accionado"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="identificacionDemandado">
            Identificación del Accionado
          </Label>
          <Input
            id="identificacionDemandado"
            value={formData.documentoDemandado}
            onChange={(e) =>
              handleInputChange("documentoDemandado", e.target.value)
            }
            placeholder="Número de identificación"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celularDemandado">Número Celular del Accionado</Label>
          <Input
            id="celularDemandado"
            type="tel"
            value={formData.celularDemandado}
            onChange={(e) =>
              handleInputChange("celularDemandado", e.target.value)
            }
            placeholder="Número de celular"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="lugarResidenciaDemandado">
            Lugar de Residencia o Notificación del Accionado
          </Label>
          <Input
            id="lugarResidenciaDemandado"
            value={formData.lugarResidenciaDemandado}
            onChange={(e) =>
              handleInputChange("lugarResidenciaDemandado", e.target.value)
            }
            placeholder="Dirección de residencia"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="correoDemandado">
            Correo Electrónico del Accionado
          </Label>
          <Input
            id="correoDemandado"
            type="email"
            value={formData.correoDemandado}
            onChange={(e) =>
              handleInputChange("correoDemandado", e.target.value)
            }
            placeholder="correo@ejemplo.com"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function Step6InfoContrato({ formData, handleInputChange }: StepProps) {
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
            onValueChange={(value) =>
              handleInputChange("tiene_contrato", value === "si")
            }
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
            <Select
              value={formData.tipoContrato}
              onValueChange={(value) =>
                handleInputChange("tipoContrato", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="escrito">Escrito</SelectItem>
                <SelectItem value="verbal">Verbal</SelectItem>
                <SelectItem value="prestacion_servicios">
                  Prestación de Servicios
                </SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreRepresentanteLegal">
                Nombre del Representante Legal o Patrono
              </Label>
              <Input
                id="nombreRepresentanteLegal"
                value={formData.nombreRepresentanteLegal}
                onChange={(e) =>
                  handleInputChange("nombreRepresentanteLegal", e.target.value)
                }
                placeholder="Nombre del empleador"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correoEmpleador">
                Correo Electrónico del Empleador
              </Label>
              <Input
                id="correoEmpleador"
                type="email"
                value={formData.correoEmpleador}
                onChange={(e) =>
                  handleInputChange("correoEmpleador", e.target.value)
                }
                placeholder="correo@empresa.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccionEmpresa">
              Dirección de la Empresa o Patrono
            </Label>
            <Input
              id="direccionEmpresa"
              value={formData.direccionEmpresa}
              onChange={(e) =>
                handleInputChange("direccionEmpresa", e.target.value)
              }
              placeholder="Dirección de la empresa"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">
                Fecha de Iniciación del Contrato
              </Label>
              <Input
                id="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) =>
                  handleInputChange("fechaInicio", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaTerminacion">
                Fecha de Terminación del Contrato
              </Label>
              <Input
                id="fechaTerminacion"
                type="date"
                value={formData.fechaTerminacion}
                onChange={(e) =>
                  handleInputChange("fechaTerminacion", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="continuaContrato">¿Continúa el Contrato?</Label>
              <Checkbox
                id="continuaContrato"
                checked={formData.continuaContrato}
                onCheckedChange={(checked: boolean) =>
                  handleInputChange("continuaContrato", checked)
                }
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
                onChange={(e) =>
                  handleInputChange("salarioInicial", e.target.value)
                }
                placeholder="Salario al iniciar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salarioActual">Salario Actual</Label>
              <Input
                id="salarioActual"
                type="number"
                value={formData.salarioActual}
                onChange={(e) =>
                  handleInputChange("salarioActual", e.target.value)
                }
                placeholder="Salario actual"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function Step7DetallesCaso({ formData, handleInputChange }: StepProps) {
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
          <Label htmlFor="area">Área *</Label>
          <Select
            required
            value={formData.area}
            onValueChange={(value) => handleInputChange("area", value)}
          >
            <SelectTrigger className="bg-white/50 focus:bg-white transition-colors">
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
          <Label htmlFor="resumen_hechos">
            Hechos Jurídicamente Relevantes para el Caso
          </Label>
          <Textarea
            id="resumen_hechos"
            value={formData.resumen_hechos}
            onChange={(e) =>
              handleInputChange("resumen_hechos", e.target.value)
            }
            placeholder="Describa los hechos relevantes del caso..."
            rows={4}
            className="bg-white/50 focus:bg-white transition-colors resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => handleInputChange("observaciones", e.target.value)}
            placeholder="Describa el servicio legal que solicita..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function Step8Firmas({ formData, handleInputChange }: StepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Firmas y Autorización
        </CardTitle>
        <CardDescription>Confirmación y firma del solicitante</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label htmlFor="cedulaSolicitante">
            C.C. del Solicitante para Firma *
          </Label>
          <Input
            id="cedulaSolicitante"
            value={formData.cedulaSolicitante}
            onChange={(e) =>
              handleInputChange("cedulaSolicitante", e.target.value)
            }
            placeholder="Número de cédula para confirmación"
            required
          />
        </div>
        <Separator />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="firmasSolicitante"
            checked={formData.firmasSolicitante}
            onCheckedChange={(checked: boolean) =>
              handleInputChange("firmasSolicitante", checked)
            }
            required
          />
          <Label htmlFor="firmasSolicitante" className="text-sm">
            Confirmo que toda la información proporcionada es veraz y autorizo
            el procesamiento de estos datos para los fines legales
            correspondientes *
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
