'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {supabase} from "utils/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
          Cerrar sesión
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Seguro que quieres cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            Se cerrará tu sesión actual y tendrás que volver a iniciar sesión para continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogOut} className="bg-red-600 hover:bg-red-700">
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
