import { supabase } from "@/utils/supabase";
import type {Usuario } from "../../src/app/types/database";

export async function insertUsuario(usuario: Usuario) {

  const { data, error } = await supabase
  .from('usuarios')
  .insert(usuario);

  if (error) {
    console.error("Error al insertar el usuario:", error);
    return [];
  }
  return data;
}
