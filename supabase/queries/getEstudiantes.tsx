import { supabase } from "@/utils/supabase";
import type {Estudiante } from "../../src/app/types/database";

export async function getEstudiantes(): Promise<Estudiante[]> {

  const { data, error } = await supabase
  .from('estudiantes')
  .select(`
    id_perfil,
    semestre,
    jornada,
    turno,
    perfil:perfiles!estudiantes_id_perfil_fkey (
      nombre_completo,
      correo,
      telefono
    )
  `);


  if (error) {
    console.error("Error al traer los estudiantes:", error);
    return [];
  }

  return data as unknown as Estudiante[];
}
