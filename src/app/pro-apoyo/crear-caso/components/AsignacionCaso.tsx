import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { Usuario, DatosCaso } from '../page';

interface AsignacionCasoProps {
  usuario: Usuario;
  onCasoRegistrado: (caso: DatosCaso) => void;
  datosIniciales?: DatosCaso | null;
}

const casosMaximos = 5;

// Datos de ejemplo
const estudiantesDisponibles = [
  { id: 1, nombre: 'Ana María Rodríguez', semestre: '8vo', turno: '9-11', casosActuales: 1 },
  { id: 2, nombre: 'Carlos Andrés López', semestre: '9no', turno: '9-11', casosActuales: 2 },
  { id: 3, nombre: 'María Fernanda Pérez', semestre: '7mo', turno: '2-4', casosActuales: 3 },
  { id: 4, nombre: 'Juan Diego Martínez', semestre: '10mo', turno: '2-4', casosActuales: 2 },
  { id: 5, nombre: 'Laura Sofía García', semestre: '8vo', turno: '4-6', casosActuales: 2 },
];

const asesoresDisponibles = [
  { id: 1, nombre: 'Dr. Roberto Sánchez', area: 'Civil', turno: 'Mañana' },
  { id: 2, nombre: 'Dra. Patricia Gómez', area: 'Penal', turno: 'Tarde' },
  { id: 3, nombre: 'Dr. Miguel Ángel Torres', area: 'Familiar', turno: 'Mañana' },
  { id: 4, nombre: 'Dra. Carmen Ruiz', area: 'Laboral', turno: 'Tarde' },
  { id: 5, nombre: 'Dr. Fernando Castro', area: 'Administrativo', turno: 'Mañana' },
];

export function AsignacionCaso({ usuario, onCasoRegistrado, datosIniciales }: AsignacionCasoProps) {
  const [estudianteId, setEstudianteId] = useState<string>('');
  const [asesorId, setAsesorId] = useState<string>('');
  const [observaciones, setObservaciones] = useState('');

  // Si vienen datos iniciales (por ejemplo al editar un caso)
  useEffect(() => {
    if (datosIniciales) {
      setEstudianteId(datosIniciales.estudiante?.id?.toString() || '');
      setAsesorId(datosIniciales.asesor?.id?.toString() || '');
      setObservaciones(datosIniciales.observaciones || '');
    }
  }, [datosIniciales]);

  const fechaCreacion = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRegistrarCaso = () => {
    if (!estudianteId || !asesorId) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const estudiante = estudiantesDisponibles.find(e => e.id.toString() === estudianteId);
    const asesor = asesoresDisponibles.find(a => a.id.toString() === asesorId);

    if (!estudiante || !asesor) return;

    const datosCaso: DatosCaso = {
      usuario,
      estudiante,
      asesor,
      fechaCreacion,
      observaciones,
    };

    onCasoRegistrado(datosCaso);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const estudianteSeleccionado = estudiantesDisponibles.find(e => e.id.toString() === estudianteId);
  const asesorSeleccionado = asesoresDisponibles.find(a => a.id.toString() === asesorId);

  return (
    <div className="space-y-6 md:min-w-3xl">
      {/* Información del profesional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Información del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre:</span>
              <p>{usuario.nombreCompleto}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Documento:</span>
              <p>{usuario.tipoDocumento.toUpperCase()} {usuario.numeroDocumento}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Correo:</span>
              <p>{usuario.correoElectronico}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Asignación */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Asignación de Caso</CardTitle>
              <CardDescription>Complete la información para registrar el nuevo caso</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estudiante */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-slate-600" />
              <h3 className="text-slate-900">Estudiante Asignado</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estudiante">Seleccionar estudiante *</Label>
              <Select value={estudianteId} onValueChange={setEstudianteId}>
                <SelectTrigger id="estudiante">
                  <SelectValue placeholder="Seleccione un estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantesDisponibles.map((estudiante) => (
                    <SelectItem key={estudiante.id} value={estudiante.id.toString()}>
                      <div className="flex flex-col">
                        <span>{estudiante.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          Semestre {estudiante.semestre} • {estudiante.casosActuales}/{casosMaximos} casos
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {estudianteSeleccionado && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-white rounded border border-slate-200 text-sm">
                <div>
                  <span className="text-muted-foreground">Semestre:</span>
                  <p>{estudianteSeleccionado.semestre}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Turno:</span>
                  <p>{estudianteSeleccionado.turno}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p>{estudianteSeleccionado.nombre}</p>
                </div>
              </div>
            )}
          </div>

          {/* Asesor */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-5 w-5 text-slate-600" />
              <h3 className="text-slate-900">Asesor Asignado</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asesor">Seleccionar asesor *</Label>
              <Select value={asesorId} onValueChange={setAsesorId}>
                <SelectTrigger id="asesor">
                  <SelectValue placeholder="Seleccione un asesor" />
                </SelectTrigger>
                <SelectContent>
                  {asesoresDisponibles.map((asesor) => (
                    <SelectItem key={asesor.id} value={asesor.id.toString()}>
                      {asesor.nombre} - {asesor.area} ({asesor.turno})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {asesorSeleccionado && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-white rounded border border-slate-200 text-sm">
                <div>
                  <span className="text-muted-foreground">Área:</span>
                  <p>{asesorSeleccionado.area}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Turno:</span>
                  <p>{asesorSeleccionado.turno}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p>{asesorSeleccionado.nombre}</p>
                </div>
              </div>
            )}
          </div>

          {/* Datos adicionales */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha de creación</Label>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                {fechaCreacion}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado inicial</Label>
              <div className="p-3 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-800">
                Pendiente de aprobación
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Ingrese cualquier observación relevante..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              onClick={handleRegistrarCaso}
              className="bg-blue-600 w-sm hover:bg-blue-700 text-white transition-colors duration-200"
              size="lg"
              disabled={!estudianteId || !asesorId}
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
