import { supabase } from "@/utils/supabase/supabase";

export async function insertEstudiantesCasos(
  id_caso: string,
  id_estudiante: string,
) {
  const { data, error } = await supabase.from("estudiantes_casos").upsert({
    id_estudiante,
    id_caso,
    fecha_asignacion: new Date().toISOString(),
    fecha_fin_asignacion: null,
  });

  if (error) {
    console.error("Error al insertar el estudiante:", error);
    throw error;
  }
  return data;
}
