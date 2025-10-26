import { supabase } from "@/utils/supabase";
import type { Caso, Demandado } from "../../src/app/types/database";

export async function getDemandadoByCasoId(id_caso: string): Promise<Demandado | null> {

  const { data, error } = await supabase
  .from('demandados')
  .select(`*
  `).eq('id_caso', id_caso).single();


  if (error) {
    console.error("Error al traer los casos:", error);
    return null;
  }

  return data as unknown as Demandado;
}
