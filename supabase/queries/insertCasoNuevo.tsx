import { supabase } from "@/lib/supabase/supabase-client";
import type { Caso } from "../../src/app/types/database";

export async function insertCasoNuevo(
  caso: Caso,
  id_usuario: string,
): Promise<Caso[]> {
  const { data, error } = await supabase
    .from("casos")
    .insert({
      id_usuario: id_usuario,
      area: caso.area,
      fecha_creacion: caso.fecha_creacion,
      estado: caso.estado,
      observaciones: caso.observaciones,
      tipo_proceso: caso.tipo_proceso || "en_proceso",
    })
    .select();

  if (error) {
    console.error("Error al insertar el caso:", error);
    throw error;
  }

  return data ?? [];
}
