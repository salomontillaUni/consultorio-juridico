import { supabase } from "@/lib/supabase/supabase-client";

export async function getProApoyo() {
  const { data, error } = await supabase
    .from("perfiles_roles")
    .select(
      `
      user_id,
      perfiles (
        id,
        nombre_completo,
        correo,
        cedula,
        telefono,
        activo
      )
    `,
    )
    .eq("role", "pro_apoyo");

  if (error) {
    console.error("Error al traer los profesionales de apoyo:", error);
    return [];
  }

  return data.map((item: any) => ({
    id_perfil: item.user_id,
    perfil: item.perfiles,
  }));
}
