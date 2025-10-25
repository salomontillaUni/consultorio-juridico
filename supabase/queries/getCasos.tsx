import { supabase } from "@/utils/supabase";
import type { Caso } from "../../src/app/types/database";

export async function getCasos(): Promise<Caso[]> {

  const { data, error } = await supabase
  .from('casos')
  .select(`
    id_caso,
    tipo_proceso,
    resumen_hechos,
    observaciones,
    area,
    estado,
    aprobacion_asesor,
    fecha_creacion,
    fecha_cierre,
    usuarios (
      id_usuario,
      nombre_completo,
      correo,
      telefono
    ),
    estudiantes_casos (
      fecha_asignacion,
      fecha_fin_asignacion,
      estudiantes (
        id_perfil,
        semestre,
        jornada,
        turno
      )
    ),
    asesores_casos (
      fecha_asignacion,
      fecha_fin_asignacion,
      asesores (
        id_perfil,
        area,
        turno
      )
    )
  `);

  if (error) {
    console.error("Error al traer los casos:", error);
    return [];
  }

  return data as unknown as Caso[];
}
