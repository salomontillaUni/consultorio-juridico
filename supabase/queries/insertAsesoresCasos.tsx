import { supabase } from "@/utils/supabase";

export async function insertAsesoresCasos( id_caso:string, id_asesor:string) {

  const { data, error } = await supabase
  .from('asesores_casos')
  .insert({
      id_asesor,
      id_caso,
    fecha_asignacion: new Date().toISOString(),
  });

  if (error) {
    console.error("Error al insertar el asesor:", error);
    return [];
  }
  return data;
}
