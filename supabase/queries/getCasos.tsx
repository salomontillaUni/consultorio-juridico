import { supabase } from "@/utils/supabase";
import type { Caso } from "../../src/app/types/database";

export async function getCasos(): Promise<Caso[]> {

  const { data, error } = await supabase
    .from("casos")
    .select(`
      id_caso,
      resumen_hechos,
      observaciones,
      fecha_creacion,
      estado,
      fecha_cierre,
      aprobacion_asesor,
      area,
      tipo_proceso,
      usuarios (
        id_usuario,
        nombre_completo,
        correo,
        telefono
      ),
      estudiantes_casos (
        id_estudiante,
        fecha_asignacion,
        fecha_fin_asignacion,
        estudiante:estudiantes (
          id_perfil,
          semestre,
          jornada,
          turno
        )
      ),
      asesores_casos (
        id_asesor,
        fecha_asignacion,
        fecha_fin_asignacion,
        asesor:asesores (
          id_perfil,
          area,
          turno
        )
      )
    `)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error al traer los casos:", error);
    return [];
  }

  return data as unknown as Caso[];
}
