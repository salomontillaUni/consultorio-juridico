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
  sexo: "M" | "F" | "O" | "";
  cedula: string;
  telefono: string;
  edad?: number | null;
  contacto_familiar?: string | null;
  estado_civil?: EstadoCivilEnum | null;
  estrato?: number | null;
  direccion?: string | null;
  correo: string;
  tipo_vivienda?: string | null;
  situacion_laboral?: string | null;
  otros_ingresos?: boolean | null;
  valor_otros_ingresos?: number | null;
  concepto_otros_ingresos?: string | null;
  tiene_contrato?: boolean;
  tiene_representado?: boolean;
};

// --- PERFILES --------------------------------------------------
export type Perfil = {
  id: string;
  nombre_completo: string;
  correo?: string | null;
  cedula?: string | null;
  telefono?: string | null;
};

// --- ESTUDIANTES -----------------------------------------------

export type Estudiante = {
  id_perfil: string;
  semestre: number;
  jornada: JornadaEnum;
  turno: TurnoEnum;
  perfil: Perfil;
};

// --- ASESORES --------------------------------------------------

export type Asesor = {
  id_perfil: string;
  perfil: Perfil;
  turno: TurnoEnum;
  area: AreaEnum;
};

// --- RELACIONES ------------------------------------------------

export type EstudianteCaso = {
  fecha_asignacion?: string | null;
  fecha_fin_asignacion?: string | null;

  // relación opcional
  estudiante: Estudiante;
};

export type AsesorCaso = {
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
  aprobacion_asesor?: boolean;
  area: AreaEnum;
  tipo_proceso?: string;

  // Relaciones
  usuarios: Usuario;
  estudiantes_casos: EstudianteCaso[];
  asesores_casos: AsesorCaso[];
};
// --- DEMANDADOS -------------------------------------------------
export type Demandado = {
  id_demandado: string;
  id_caso: number;
  nombre_completo: string;
  documento: string | null;
  celular: string | null;
  lugar_residencia: string | null;
  correo: string | null;
};
