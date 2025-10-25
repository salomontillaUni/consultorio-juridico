export type Usuario = {
  id_usuario: string; // UUID
  nombre_completo: string;
  sexo?: "M" | "F" | null;
  cedula?: string | null;
  telefono?: string | null;
  edad?: number | null;
  contacto_familiar?: string | null;
  estado_civil?: "soltero" | "casado" | "union libre" | null;
  estrato?: number | null;
  direccion?: string | null;
  correo?: string | null;
  tipo_vivienda?: 'propia' | 'arriendo' | 'familiar' | null;
  situacion_laboral?: 'empleado' | 'desempleado' | 'estudiante' | 'independiente' | null;
  otros_ingresos?: boolean | null;
  valor_otros_ingresos?: number | null;
  concepto_otros_ingresos?: string | null;
  tiene_contrato: boolean;
  tiene_representado: boolean;
};

export type Caso = {
  id_caso: number;
  id_usuario: string;
  resumen_hechos?: string | null;
  observaciones?: string | null;
  fecha_creacion: string; 
  estado: "aprobado" | "en_proceso" | "pendiente_aprobacion" | "cerrado" | "archivado";
  fecha_cierre?: string | null;
  aprobacion_asesor: boolean;
  area: "laboral" | "familia" | "penal" | "civil" | "otros";
  tipo_proceso: string;
  // relación
  usuarios?: Usuario;
};
