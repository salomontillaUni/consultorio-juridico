import { supabase } from "@/utils/supabase/supabase";
import type { Asesor } from "../../src/app/types/database";

export async function getAsesores(): Promise<Asesor[]> {
  const { data, error } = await supabase.from("asesores").select(`
    id_perfil,
    turno,
    area,
    perfil:perfiles!asesores_id_perfil_fkey (
      nombre_completo,
      correo,
      telefono,
      activo,
      cedula
    ),
    asesores_casos(count)
  `);

  if (error) {
    console.error("Error al traer los asesores:", error);
    return [];
  }

  const formattedData = data?.map((ase) => ({
    ...ase,
    total_casos: ase.asesores_casos?.[0]?.count || 0,
  }));

  return formattedData as unknown as Asesor[];
}
