import { supabase } from "@/utils/supabase/supabase-client";
import type { Estudiante } from "../../src/app/types/database";

export async function getEstudiantes(
  soloActivos: boolean = false,
): Promise<Estudiante[]> {
  let query = supabase.from("estudiantes").select(`
    id_perfil,
    semestre,
    jornada,
    turno,
    perfil:perfiles!${soloActivos ? "inner" : "estudiantes_id_perfil_fkey"} (
      nombre_completo,
      correo,
      telefono,
      cedula,
      activo
    ),
    estudiantes_casos(count)
  `);

  if (soloActivos) {
    query = query.eq("perfiles.activo", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al traer los estudiantes:", error);
    return [];
  }

  const formattedData = data?.map((est) => ({
    ...est,
    total_casos: est.estudiantes_casos?.[0]?.count || 0,
  }));

  return formattedData as unknown as Estudiante[];
}
