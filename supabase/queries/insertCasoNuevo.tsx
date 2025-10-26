import { supabase } from "@/utils/supabase";
import type {Caso } from "../../src/app/types/database";
import { Esteban } from "next/font/google";

export async function insertCasoNuevo(caso: Caso, id_usuario: string) {

  const { data, error } = await supabase
  .from('casos')
  .insert({
    id_usuario: id_usuario,
    area: caso.area,
    fecha_creacion: caso.fecha_creacion,
    estado: caso.estado,
    observaciones: caso.observaciones
  });

  if (error) {
    console.error("Error al insertar el caso:", error);
    return [];
  }
  return data;
}
