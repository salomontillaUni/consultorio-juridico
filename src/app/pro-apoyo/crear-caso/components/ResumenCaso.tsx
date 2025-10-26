import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Caso, Usuario } from 'app/types/database';
import { insertUsuarioNuevo } from '../../../../../supabase/queries/insertUsuarioNuevo';
import { insertCasoNuevo } from '../../../../../supabase/queries/insertCasoNuevo';
import { insertEstudiantesCasos } from '../../../../../supabase/queries/insertEstudiantesCasos';

interface ResumenCasoProps {
  caso: Caso;
  usuario: Usuario;
  onNuevoCaso: () => void;
}

export function ResumenCaso({ caso, usuario, onNuevoCaso }: ResumenCasoProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [casoInsertar, setCasoInsertar] = useState<Caso>(caso);
  const [usuarioInsertar, setUsuarioInsertar] = useState<Usuario>(usuario);

  const handleConfirmacion = () => {
    setDialogOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Caso a insertar:", caso);
    console.log("Usuario a insertar:", usuario);
    
  };

  const insertData = async () => {
    setIsLoading(true);
    try{
      await insertUsuarioNuevo(usuario);
      const usuarioData = await insertUsuarioNuevo(usuario);
      console.log(usuarioData);
      const id_usuario = usuarioData?.[0]?.id_usuario;
      const casoData = await insertCasoNuevo(caso, id_usuario);
      console.log(casoData);

    }catch (error) {
      console.error("Error al insertar el usuario:", error);
    }finally {
      setIsLoading(false);
    }
  };

  const handleNuevoCaso = () => {
    setDialogOpen(false);
    onNuevoCaso();
  };

  return (
    <div className="space-y-6 md:min-w-3xl">
      {/* Resumen completo del caso */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Resumen del Caso</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información del usuario */}
          <div>
            <h3 className="text-slate-900 mb-3">Profesional que Registra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Nombre completo</span>
                <p className="text-slate-900">{caso.usuarios.nombre_completo}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Sexo</span>
                <p className="text-slate-900">
                  Sexo {caso.usuarios.sexo}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Documento</span>
                <p className="text-slate-900">
                  Documento {caso.usuarios.cedula}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Teléfono</span>
                <p className="text-slate-900">{caso.usuarios.telefono}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Correo electrónico</span>
                <p className="text-slate-900">{caso.usuarios.correo}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estudiante asignado */}
          <div>
            <h3 className="text-slate-900 mb-3">Estudiante Asignado</h3>
            {caso.estudiantes_casos && caso.estudiantes_casos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <span className="text-sm text-muted-foreground">Nombre</span>
                  <p className="text-slate-900">
                    {caso.estudiantes_casos[0].estudiante.perfil.nombre_completo}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Semestre</span>
                  <p className="text-slate-900">
                    {caso.estudiantes_casos[0].estudiante.semestre}
                  </p>
                </div>
                <div>
                  <span className="flex text-sm text-muted-foreground">Turno</span>
                  <Badge variant="outline">
                    {caso.estudiantes_casos[0].estudiante.turno}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">Sin estudiante asignado</p>
            )}
          </div>

          <Separator />

          {/* Asesor asignado */}
          <div>
            {caso.asesores_casos && caso.asesores_casos.length > 0 ? (
              <>
                <h3 className="text-slate-900 mb-3">Asesor Asignado</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
                  <div>
                    <span className="text-sm text-muted-foreground">Nombre</span>
                    <p className="text-slate-900">{caso.asesores_casos[0]?.asesor.perfil.nombre_completo}</p>
                  </div>
                  <div>
                    <span className="flex text-sm text-muted-foreground">Área</span>
                    <Badge variant="outline">{caso.asesores_casos[0]?.asesor.area}</Badge>
                  </div>
                  <div>
                    <span className="flex text-sm text-muted-foreground">Turno</span>
                    <Badge variant="secondary">{caso.asesores_casos[0]?.asesor.turno}</Badge>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm italic">Sin asesor asignado</p>
            )}
          </div>

          <Separator />

          {/* Información del caso */}
          <div>
            <h3 className="text-slate-900 mb-3">Información del Caso</h3>
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Fecha de creación</span>
                  <p className="text-slate-900">{caso.fecha_creacion.split('T')[0]}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <div className="mt-1">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Pendiente de aprobación
                    </Badge>
                  </div>
                </div>
              </div>
              {caso.observaciones && (
                <div>
                  <span className="text-sm text-muted-foreground">Observaciones</span>
                  <p className="text-slate-900 mt-1 whitespace-pre-wrap">{caso.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de acción */}
      <div className="flex justify-center">
        <Button
          onClick={handleConfirmacion}
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          size="lg"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Crear Caso
        </Button>
      </div>

      {/* Modal de confirmación */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Caso creado exitosamente
            </DialogTitle>
            <DialogDescription>
              El caso se ha registrado correctamente en el sistema. Puedes crear uno nuevo o cerrar esta ventana.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center items-center">
            <Button onClick={handleNuevoCaso} className="w-full bg-blue-600 hover:bg-blue-700">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
