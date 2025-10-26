import { supabase } from "@/utils/supabase";

export async function insertEstudiantesCasos( id_caso:string, id_estudiante:string) {

  const { data, error } = await supabase
  .from('estudiantes_casos')
  .insert({
      id_estudiante,
      id_caso,
    fecha_asignacion: new Date().toISOString(),
  });

  if (error) {
    console.error("Error al insertar el usuario:", error);
    return [];
  }
  return data;
}
