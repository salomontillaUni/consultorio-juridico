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
      cedula,
      nombre_completo,
      correo,
      telefono
    ),
    estudiantes_casos (
      fecha_asignacion,
      fecha_fin_asignacion,
      estudiante:estudiantes!estudiantes_casos_id_estudiante_fkey (
        id_perfil,
        semestre,
        jornada,
        turno,
        perfil:perfiles!estudiantes_id_perfil_fkey (
          nombre_completo,
          correo,
          telefono
        )
      )
    ),
    asesores_casos (
      fecha_asignacion,
      fecha_fin_asignacion,
      asesor:asesores!asesores_casos_id_asesor_fkey (
        id_perfil,
        area,
        turno,
        perfil:perfiles!asesores_id_perfil_fkey (
          nombre_completo,
          correo,
          telefono
        )
      )
    )
  `);





  if (error) {
    console.error("Error al traer los casos:", error);
    return [];
  }

  return data as unknown as Caso[];
}
