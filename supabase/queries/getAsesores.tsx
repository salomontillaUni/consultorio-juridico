import { supabase } from "@/utils/supabase";
import type {Asesor } from "../../src/app/types/database";

export async function getAsesores(): Promise<Asesor[]> {

  const { data, error } = await supabase
  .from('asesores')
  .select(`
    id_perfil,
    turno,
    area,
    perfil:perfiles!asesores_id_perfil_fkey (
      nombre_completo,
      correo,
      telefono
    )
  `);


  if (error) {
    console.error("Error al traer los asesores:", error);
    return [];
  }

  return data as unknown as Asesor[];
}
