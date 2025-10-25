// --- ENUMS -----------------------------------------------------

export type EstadoEnum = "aprobado" | "en_proceso" | "pendiente_aprobacion" | "cerrado" | "archivado";
export type AreaEnum = "laboral" | "familia" | "penal" | "civil" | "otros";
export type TurnoEnum = "9-11" | "2-4" | "4-6";
export type JornadaEnum = "diurna" | "nocturna" | "mixto";
export type EstadoCivilEnum = "soltero" | "casado" | "union libre" | 'otro';
export type TipoContratoEnum = 'escrito' | 'verbal' | 'prestacion_servicios' | 'otro';

// --- USUARIOS --------------------------------------------------

export type Usuario = {
  id_usuario: string;
  nombre_completo: string;
  sexo?: "M" | "F" | null;
  cedula?: string | null;
  telefono?: string | null;
  edad?: number | null;
  contacto_familiar?: string | null;
  estado_civil?: EstadoCivilEnum | null;
  estrato?: number | null;
  direccion?: string | null;
  correo?: string | null;
  tipo_vivienda?: string | null;
  situacion_laboral?: string | null;
  otros_ingresos?: boolean | null;
  valor_otros_ingresos?: number | null;
  concepto_otros_ingresos?: string | null;
  tiene_contrato: boolean;
  tiene_representado: boolean;
};

// --- ESTUDIANTES -----------------------------------------------

export type Estudiante = {
  id_perfil: string;
  semestre: number;
  jornada: JornadaEnum;
  turno: TurnoEnum;
};

// --- ASESORES --------------------------------------------------

export type Asesor = {
  id_perfil: string;
  turno: TurnoEnum;
  area: AreaEnum;
};

// --- RELACIONES ------------------------------------------------

export type EstudianteCaso = {
  id_estudiante: string;
  id_caso: number;
  fecha_asignacion?: string | null;
  fecha_fin_asignacion?: string | null;

  // relación opcional
  estudiante: Estudiante;
};

export type AsesorCaso = {
  id_asesor: string;
  id_caso: number;
  fecha_asignacion?: string | null;
  fecha_fin_asignacion?: string | null;

  // relación opcional
  asesor: Asesor;
};

// --- CASOS -----------------------------------------------------

export type Caso = {
  id_caso: number;
  id_usuario: string;
  resumen_hechos?: string | null;
  observaciones?: string | null;
  fecha_creacion: string;
  estado: EstadoEnum;
  fecha_cierre?: string | null;
  aprobacion_asesor: boolean;
  area: AreaEnum;
  tipo_proceso: string;

  // Relaciones
  usuarios: Usuario;
  estudiantes_casos: EstudianteCaso[];
  asesores_casos: AsesorCaso[];
};
