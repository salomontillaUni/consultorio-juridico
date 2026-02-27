import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { insertAsesoresCasos } from '../../../../../supabase/queries/insertAsesoresCasos';

interface ResumenCasoProps {
  caso: Caso;
  usuario: Usuario;
  onNuevoCaso: () => void;
}

export function ResumenCaso({ caso, usuario, onNuevoCaso }: ResumenCasoProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [casoInsertar, setCasoInsertar] = useState<Caso>(caso);
  const [usuarioInsertar, setUsuarioInsertar] = useState<Usuario>(usuario);

  const handleConfirmacion = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Caso a insertar:", caso);
    console.log("Usuario a insertar:", usuario);
    insertData();
  };

  const insertData = async () => {
    console.log("Iniciando inserción de datos...");
  setIsLoading(true);
  try {
    const usuarioData = await insertUsuarioNuevo(usuario);

    const id_usuario = usuarioData?.[0]?.id_usuario;
    if (!id_usuario) {
      throw new Error("No se obtuvo el id_usuario del usuario insertado");
    }
    const casoData = await insertCasoNuevo(caso, id_usuario);
    console.log("Caso insertado:", casoData);

    const id_estudiante = caso.estudiantes_casos?.[0]?.estudiante.id_perfil;
    const id_caso = casoData?.[0]?.id_caso;
    const id_asesor = caso.asesores_casos?.[0]?.asesor.id_perfil;

    if (id_caso && id_estudiante && id_asesor) {
      await insertEstudiantesCasos(id_caso.toString(), id_estudiante);
      await insertAsesoresCasos(id_caso.toString(), id_asesor);
    } else {
      console.error("Faltan IDs para vincular estudiante o asesor al caso.");
    }
    setDialogOpen(true);
    toast.success("Caso creado exitosamente");
  } catch (error: any) {
    console.error("Error al insertar el usuario:", error);
    let msg = "Ocurrió un error inesperado al registrar el caso.";
    
    if (error.code === '23505') {
      console.log("Error al insertar el usuario:", error);
       if (error.message.includes('usuarios_cedula_key')) {
         msg = "Error: Ya existe un usuario registrado con esta cédula.";
       } else {
         msg = "Error: Ya existe un registro con estos datos únicos.";
       }
    } else if (error.message) {
      msg = error.message;
    }
    
    setErrorMessage(msg);
    setErrorDialogOpen(true);
    toast.error(msg);
  } finally {
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
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Procesando...
            </div>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Crear Caso
            </>
          )}
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

      {/* Modal de error */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-md border-red-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Error al crear el caso
            </DialogTitle>
            <DialogDescription className="text-slate-700 font-medium py-2">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center items-center">
            <Button 
              onClick={() => setErrorDialogOpen(false)} 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
