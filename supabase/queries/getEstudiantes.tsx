import { supabase } from "@/utils/supabase/supabase";
import type { Estudiante } from "../../src/app/types/database";

export async function getEstudiantes(): Promise<Estudiante[]> {
  const { data, error } = await supabase.from("estudiantes").select(`
    id_perfil,
    semestre,
    jornada,
    turno,
    perfil:perfiles!estudiantes_id_perfil_fkey (
      nombre_completo,
      correo,
      telefono
    ),
    estudiantes_casos(count)
  `);

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
