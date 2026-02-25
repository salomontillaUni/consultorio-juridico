"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/NavbarAdmin";
import { registerProApoyo } from "../actions/registerUser";
import { UserPlus, Loader2 } from "lucide-react";

interface ProApoyoForm {
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
}

const EMPTY_FORM: ProApoyoForm = {
  nombre: "",
  correo: "",
  cedula: "",
  telefono: "",
};

export default function ProApoyoPage() {
  const [form, setForm] = useState<ProApoyoForm>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof ProApoyoForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.correo || !form.cedula || !form.telefono) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }

    startTransition(async () => {
      const result = await registerProApoyo({
        nombre_completo: form.nombre,
        correo: form.correo,
        cedula: form.cedula,
        telefono: form.telefono,
      });

      if (result.success) {
        toast.success(result.message);
        setForm(EMPTY_FORM);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Registrar Profesional de Apoyo
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Crea una nueva cuenta de profesional de apoyo en el sistema del
              consultorio jurídico.
            </p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">
              Información del Profesional de Apoyo
            </CardTitle>
            <CardDescription>
              Todos los campos son obligatorios. Se generará una contraseña
              temporal que deberá cambiarse en el primer inicio de sesión.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Datos personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-nombre">Nombre Completo</Label>
                    <Input
                      id="proapoyo-nombre"
                      placeholder="Ej: Ana Martínez Pérez"
                      value={form.nombre}
                      onChange={(e) => set("nombre")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-correo">Correo Electrónico</Label>
                    <Input
                      id="proapoyo-correo"
                      type="email"
                      placeholder="profesional@uac.edu.co"
                      value={form.correo}
                      onChange={(e) => set("correo")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-cedula">Cédula</Label>
                    <Input
                      id="proapoyo-cedula"
                      placeholder="Número de cédula"
                      value={form.cedula}
                      onChange={(e) => set("cedula")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-telefono">Teléfono</Label>
                    <Input
                      id="proapoyo-telefono"
                      placeholder="Ej: 3001234567"
                      value={form.telefono}
                      onChange={(e) => set("telefono")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Profesional"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
