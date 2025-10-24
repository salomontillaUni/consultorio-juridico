import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, PlusCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DatosCaso } from '../CreateCasePage';

interface ResumenCasoProps {
  caso: DatosCaso;
  onNuevoCaso: () => void;
}

export function ResumenCaso({ caso, onNuevoCaso }: ResumenCasoProps) {
  const handleExportar = () => {
    // Crear objeto con todos los datos del caso
    const datosExportar = {
      profesional: {
        nombre: caso.usuario.nombreCompleto,
        documento: `${caso.usuario.tipoDocumento.toUpperCase()} ${caso.usuario.numeroDocumento}`,
        telefono: caso.usuario.telefono,
        correo: caso.usuario.correoElectronico,
      },
      estudiante: {
        nombre: caso.estudiante.nombre,
        semestre: caso.estudiante.semestre,
        turno: caso.estudiante.turno,
      },
      asesor: {
        nombre: caso.asesor.nombre,
        area: caso.asesor.area,
        turno: caso.asesor.turno,
      },
      caso: {
        fechaCreacion: caso.fechaCreacion,
        estado: 'Pendiente de aprobación',
        observaciones: caso.observaciones || 'Sin observaciones',
      },
    };

    // Crear texto formateado para exportar
    const textoExportar = `
═══════════════════════════════════════════
    RESUMEN DE CASO REGISTRADO
═══════════════════════════════════════════

PROFESIONAL QUE REGISTRA
────────────────────────────────────────
Nombre: ${datosExportar.profesional.nombre}
Documento: ${datosExportar.profesional.documento}
Teléfono: ${datosExportar.profesional.telefono}
Correo: ${datosExportar.profesional.correo}

ESTUDIANTE ASIGNADO
────────────────────────────────────────
Nombre: ${datosExportar.estudiante.nombre}
Semestre: ${datosExportar.estudiante.semestre}
Turno: ${datosExportar.estudiante.turno}

ASESOR ASIGNADO
────────────────────────────────────────
Nombre: ${datosExportar.asesor.nombre}
Área: ${datosExportar.asesor.area}
Turno: ${datosExportar.asesor.turno}

INFORMACIÓN DEL CASO
────────────────────────────────────────
Fecha de creación: ${datosExportar.caso.fechaCreacion}
Estado: ${datosExportar.caso.estado}

Observaciones:
${datosExportar.caso.observaciones}

═══════════════════════════════════════════
Documento generado automáticamente
${new Date().toLocaleString('es-ES')}
═══════════════════════════════════════════
`;

    // Crear archivo de texto y descargarlo
    const blob = new Blob([textoExportar], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caso-${caso.usuario.numeroDocumento}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Caso exportado exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header con ícono de éxito */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-green-500 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-green-900 mb-2">¡Caso Registrado Exitosamente!</h2>
              <p className="text-green-700">
                El caso ha sido creado y asignado correctamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {/* Información del profesional */}
          <div>
            <h3 className="text-slate-900 mb-3">Profesional que Registra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Nombre completo</span>
                <p className="text-slate-900">{caso.usuario.nombreCompleto}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Documento</span>
                <p className="text-slate-900">
                  {caso.usuario.tipoDocumento.toUpperCase()} {caso.usuario.numeroDocumento}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Teléfono</span>
                <p className="text-slate-900">{caso.usuario.telefono}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Correo electrónico</span>
                <p className="text-slate-900">{caso.usuario.correoElectronico}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estudiante asignado */}
          <div>
            <h3 className="text-slate-900 mb-3">Estudiante Asignado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Nombre</span>
                <p className="text-slate-900">{caso.estudiante.nombre}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Semestre</span>
                <p className="text-slate-900">{caso.estudiante.semestre}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Turno</span>
                <Badge variant="default">{caso.estudiante.turno}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Asesor asignado */}
          <div>
            <h3 className="text-slate-900 mb-3">Asesor Asignado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Nombre</span>
                <p className="text-slate-900">{caso.asesor.nombre}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Área</span>
                <Badge variant="outline">{caso.asesor.area}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Turno</span>
                <Badge variant="secondary">{caso.asesor.turno}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información del caso */}
          <div>
            <h3 className="text-slate-900 mb-3">Información del Caso</h3>
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Fecha de creación</span>
                  <p className="text-slate-900">{caso.fechaCreacion}</p>
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

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleExportar}
          size="lg"
          className="flex-1"
          variant="default"
        >
          <Download className="mr-2 h-5 w-5" />
          Exportar Resumen
        </Button>
        <Button 
          onClick={onNuevoCaso}
          size="lg"
          className="flex-1"
          variant="outline"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Registrar Nuevo Caso
        </Button>
      </div>
    </div>
  );
}
