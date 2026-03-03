import { supabase } from "@/utils/supabase/supabase";

export async function getProApoyo() {
  const { data, error } = await supabase
    .from("perfiles_roles")
    .select(
      `
      user_id,
      perfil:perfiles!perfiles_roles_user_id_fkey (
        nombre_completo,
        correo,
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
    perfil: item.perfil,
  }));
}
