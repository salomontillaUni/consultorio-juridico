import { supabase } from "@/utils/supabase/supabase-client";

export async function updateObservaciones(
  id_caso: string,
  observaciones: string,
) {
  const { data, error } = await supabase
    .from("casos")
    .update({ observaciones })
    .eq("id_caso", id_caso)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar observaciones:", error);
    throw error;
  }

  return data;
}
