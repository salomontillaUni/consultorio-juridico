"use server";

import { supabaseAdmin } from "@/utils/supabase/supabase-admin";
import { revalidatePath } from "next/cache";

type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function toggleUserStatus(
  userId: string,
  currentStatus: boolean,
): Promise<ActionResult> {
  const { error } = await supabaseAdmin
    .from("perfiles")
    .update({ activo: !currentStatus })
    .eq("id", userId);

  if (error) {
    console.error("Error toggling user status:", error);
    return { success: false, error: "Error al cambiar el estado del usuario." };
  }

  revalidatePath("/admin/estudiantes");
  revalidatePath("/admin/asesores");
  revalidatePath("/admin/proapoyo");

  return {
    success: true,
    message: `Usuario ${currentStatus ? "desactivado" : "activado"} exitosamente.`,
  };
}

export async function deleteUser(
  userId: string,
  role: string,
): Promise<ActionResult> {
  // Roles tables (estudiantes/asesores) use cascading or should be deleted manually if not
  // But perfiles_roles and perfiles definitely use user_id

  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    console.error("Error deleting auth user:", authError);
    return {
      success: false,
      error: "Error al eliminar el usuario del sistema de autenticación.",
    };
  }

  revalidatePath("/admin/estudiantes");
  revalidatePath("/admin/asesores");
  revalidatePath("/admin/proapoyo");

  return { success: true, message: "Usuario eliminado exitosamente." };
}

export async function updateEstudiante(
  userId: string,
  data: any,
): Promise<ActionResult> {
  const { error: perfilError } = await supabaseAdmin
    .from("perfiles")
    .update({
      nombre_completo: data.nombre_completo,
      telefono: data.telefono,
      cedula: data.cedula,
    })
    .eq("id", userId);

  if (perfilError)
    return { success: false, error: "Error al actualizar el perfil." };

  const { error: estError } = await supabaseAdmin
    .from("estudiantes")
    .update({
      semestre: data.semestre,
      jornada: data.jornada,
      turno: data.turno,
    })
    .eq("id_perfil", userId);

  if (estError)
    return {
      success: false,
      error: "Error al actualizar los datos académicos.",
    };

  revalidatePath("/admin/estudiantes");
  return { success: true, message: "Estudiante actualizado exitosamente." };
}

export async function updateAsesor(
  userId: string,
  data: any,
): Promise<ActionResult> {
  const { error: perfilError } = await supabaseAdmin
    .from("perfiles")
    .update({
      nombre_completo: data.nombre_completo,
      telefono: data.telefono,
      cedula: data.cedula,
    })
    .eq("id", userId);

  if (perfilError)
    return { success: false, error: "Error al actualizar el perfil." };

  const { error: aseError } = await supabaseAdmin
    .from("asesores")
    .update({
      turno: data.turno,
      area: data.area,
    })
    .eq("id_perfil", userId);

  if (aseError)
    return {
      success: false,
      error: "Error al actualizar los datos del asesor.",
    };

  revalidatePath("/admin/asesores");
  return { success: true, message: "Asesor actualizado exitosamente." };
}

export async function updateProApoyo(
  userId: string,
  data: any,
): Promise<ActionResult> {
  const { error: perfilError } = await supabaseAdmin
    .from("perfiles")
    .update({
      nombre_completo: data.nombre_completo,
      telefono: data.telefono,
      cedula: data.cedula,
    })
    .eq("id", userId);

  if (perfilError)
    return { success: false, error: "Error al actualizar el perfil." };

  revalidatePath("/admin/proapoyo");
  return {
    success: true,
    message: "Profesional de apoyo actualizado exitosamente.",
  };
}
