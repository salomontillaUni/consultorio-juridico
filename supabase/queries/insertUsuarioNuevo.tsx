import { supabase } from "@/utils/supabase";
import type {Usuario } from "../../src/app/types/database";

export async function insertUsuarioNuevo(usuario: Usuario) {

  const { data, error } = await supabase
  .from('usuarios')
  .insert({
    cedula: usuario.cedula,
    correo: usuario.correo,
    nombre_completo: usuario.nombre_completo,
    sexo: usuario.sexo,
    telefono: usuario.telefono
  });

  if (error) {
    console.error("Error al insertar el usuario:", error);
    return [];
  }
  return data;
}
