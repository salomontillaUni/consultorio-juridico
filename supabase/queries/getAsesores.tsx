import { supabase } from "@/lib/supabase/supabase-client";
import type { Asesor } from "../../src/app/types/database";

export async function getAsesores(
  soloActivos: boolean = false,
): Promise<Asesor[]> {
  let query = supabase.from("asesores").select(`
    id_perfil,
    turno,
    area,
    perfil:perfiles!${soloActivos ? "inner" : "asesores_id_perfil_fkey"} (
      nombre_completo,
      correo,
      telefono,
      activo,
      cedula
    ),
    asesores_casos(count)
  `);

  if (soloActivos) {
    query = query.eq("perfiles.activo", true);
  }

  const { data, error } = await query;

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
