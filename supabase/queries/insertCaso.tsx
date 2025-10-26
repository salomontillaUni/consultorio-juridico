import { supabase } from "@/utils/supabase";
import type {Caso } from "../../src/app/types/database";

export async function insertCaso(caso: Caso) {

  const { data, error } = await supabase
  .from('casos')
  .insert(caso);

  if (error) {
    console.error("Error al insertar el caso:", error);
    return [];
  }
  return data;
}
