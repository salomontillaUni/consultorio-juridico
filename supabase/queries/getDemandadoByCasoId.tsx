import { supabase } from "@/utils/supabase";
import type { Demandado } from "../../src/app/types/database";

export async function getDemandadoByCasoId(id_caso: string | number): Promise<Demandado | null> {
  const casoId = typeof id_caso === "string" ? parseInt(id_caso, 10) : id_caso;

  const { data, error } = await supabase
    .from("demandados")
    .select("*")
    .eq("id_caso", casoId)
    .maybeSingle();

  if (error) {
    // Si no hay registro, error.code === "PGRST116" (no rows)
    if (error.code !== "PGRST116") {
      console.error("Error fetching demandado by caso ID:", error);
    }
    return null;
  }

  return data;
}
