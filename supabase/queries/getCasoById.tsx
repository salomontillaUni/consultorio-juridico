import { supabase } from "@/utils/supabase";
import type { Caso } from "../../src/app/types/database";

export async function getCasoById(id_caso: string): Promise<Caso> {
  const { data, error } = await supabase
    .from("casos")
    .select(`
      id_caso,
      id_usuario,
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
    `)
    .eq("id_caso", id_caso)
    .single(); //devuelve un solo registro, no un array

  if (error) {
    console.error("Error al traer el caso:", error);
    return Promise.reject(error);
  }

  return data as unknown as Caso;
}
