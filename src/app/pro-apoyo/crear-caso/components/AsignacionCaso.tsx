import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Asesor, Caso, Estudiante, Usuario } from 'app/types/database';
import { getEstudiantes } from '../../../../../supabase/queries/getEstudiantes';
import { getAsesores } from '../../../../../supabase/queries/getAsesores';

interface AsignacionCasoProps {
  usuario: Usuario;
  onCasoRegistrado: (caso: Caso) => void;
  datosIniciales?: Caso | null;
}

const casosMaximos = 5;


export function AsignacionCaso({ usuario, onCasoRegistrado, datosIniciales }: AsignacionCasoProps) {
  const [estudianteId, setEstudianteId] = useState<string>('');
  const [asesorId, setAsesorId] = useState<string>('');
  const [observaciones, setObservaciones] = useState('');
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<Estudiante[]>([]);
  const [asesoresDisponibles, setAsesoresDisponibles] = useState<Asesor[]>([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState<Asesor | null>(null);

  // Si vienen datos iniciales (por ejemplo al editar un caso)
  useEffect(() => {
    if (datosIniciales) {
      setEstudianteId(datosIniciales.estudiantes_casos[0]?.estudiante.id_perfil?.toString() || '');
      setAsesorId(datosIniciales.asesores_casos[0]?.asesor.id_perfil?.toString() || '');
      setObservaciones(datosIniciales.observaciones || '');
    }
  }, [datosIniciales]);

  // Cargar estudiantes y asesores disponibles al montar
  useEffect(() => {
    const getData = async () => {
      try {
        const estudiantes = await getEstudiantes(); 
        setEstudiantesDisponibles(estudiantes);

        const asesores = await getAsesores();
        setAsesoresDisponibles(asesores);
      } catch (error) {
        console.error("Error al obtener estudiantes o asesores:", error);
        toast.error('Error al obtener estudiantes o asesores');
      }
    };

    getData();
  }, []);

  const handleRegistrarCaso = () => {
    if (!estudianteId || !asesorId) {
      console.error('Por favor complete todos los campos requeridos');
      return;
    }

    const estudiante = estudiantesDisponibles.find(e => e.id_perfil.toString() === estudianteId);
    const asesor = asesoresDisponibles.find(a => a.id_perfil.toString() === asesorId);

    if (!estudiante || !asesor) {
      console.error("No se pudo encontrar el estudiante o asesor seleccionado");
      return;
    }
    console.log(datosIniciales)
    const datosCaso: Caso = {
      id_caso: datosIniciales?.id_caso || 0,
      id_usuario: usuario.id_usuario,
      area: datosIniciales?.area || 'otros',
      fecha_creacion: datosIniciales?.fecha_creacion || new Date().toISOString(),
      estado: datosIniciales?.estado || 'pendiente_aprobacion',
      usuarios: usuario,
      estudiantes_casos: [{ estudiante }],
      asesores_casos: [{ asesor }],
      observaciones,
    };

    onCasoRegistrado(datosCaso);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="space-y-6 md:min-w-3xl">
      {/* Información del profesional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Información del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre:</span>
              <p>{usuario.nombre_completo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Sexo:</span>
              <p>{usuario.sexo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Cedula:</span>
              <p>{usuario.cedula}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Correo:</span>
              <p>{usuario.correo}</p>
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
              <h3 className="text-slate-900">Asignar a un estudiante</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estudiante">Seleccionar estudiante *</Label>
              <Select value={estudianteId} onValueChange={setEstudianteId}>
                <SelectTrigger id="estudiante">
                  <SelectValue placeholder="Seleccione un estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantesDisponibles.map((estudiante) => (
                    <SelectItem key={estudiante.id_perfil} value={estudiante.id_perfil.toString()}>
                      <div className="flex flex-col">
                        <span>{estudiante.perfil.nombre_completo}</span>
                        <span className="text-xs text-muted-foreground">
                          Semestre {estudiante.semestre} • n/{casosMaximos} casos
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
                  <p>{estudianteSeleccionado.perfil.nombre_completo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Asesor */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-5 w-5 text-slate-600" />
              <h3 className="text-slate-900">Asignar a un asesor</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asesor">Seleccionar asesor *</Label>
              <Select value={asesorId} onValueChange={setAsesorId}>
                <SelectTrigger id="asesor">
                  <SelectValue placeholder="Seleccione un asesor" />
                </SelectTrigger>
                <SelectContent>
                  {asesoresDisponibles.map((asesor) => (
                    <SelectItem key={asesor.id_perfil} value={asesor.id_perfil.toString()}>
                      {asesor.perfil.nombre_completo} - {asesor.area} ({asesor.turno})
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
                  <p>{asesorSeleccionado.perfil.nombre_completo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Datos adicionales */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha de creación</Label>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                {new Date().toLocaleDateString()}
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
