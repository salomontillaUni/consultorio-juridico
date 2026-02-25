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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/NavbarAdmin";
import { registerAsesor } from "../actions/registerUser";
import type { AreaEnum, TurnoEnum } from "../../types/database";
import { Users, Loader2 } from "lucide-react";

interface AsesorForm {
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  turno: TurnoEnum | "";
  area: AreaEnum | "";
}

const EMPTY_FORM: AsesorForm = {
  nombre: "",
  correo: "",
  cedula: "",
  telefono: "",
  turno: "",
  area: "",
};

export default function AsesoresPage() {
  const [form, setForm] = useState<AsesorForm>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof AsesorForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre || !form.correo || !form.cedula ||
      !form.telefono || !form.turno || !form.area
    ) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }

    startTransition(async () => {
      const result = await registerAsesor({
        nombre_completo: form.nombre,
        correo: form.correo,
        cedula: form.cedula,
        telefono: form.telefono,
        turno: form.turno as TurnoEnum,
        area: form.area as AreaEnum,
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
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Registrar Asesor
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Crea una nueva cuenta de docente asesor en el sistema del
              consultorio jurídico.
            </p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Información del Asesor</CardTitle>
            <CardDescription>
              Todos los campos son obligatorios. Se generará una contraseña
              temporal que deberá cambiarse en el primer inicio de sesión.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Datos personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-nombre">Nombre Completo</Label>
                    <Input
                      id="asesor-nombre"
                      placeholder="Ej: Carlos Ramírez Torres"
                      value={form.nombre}
                      onChange={(e) => set("nombre")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-correo">Correo Electrónico</Label>
                    <Input
                      id="asesor-correo"
                      type="email"
                      placeholder="asesor@uac.edu.co"
                      value={form.correo}
                      onChange={(e) => set("correo")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-cedula">Cédula</Label>
                    <Input
                      id="asesor-cedula"
                      placeholder="Número de cédula"
                      value={form.cedula}
                      onChange={(e) => set("cedula")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-telefono">Teléfono</Label>
                    <Input
                      id="asesor-telefono"
                      placeholder="Ej: 3001234567"
                      value={form.telefono}
                      onChange={(e) => set("telefono")(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>

              {/* Role-specific Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Asignación académica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-turno">Turno</Label>
                    <Select
                      value={form.turno}
                      onValueChange={set("turno")}
                      disabled={isPending}
                    >
                      <SelectTrigger id="asesor-turno">
                        <SelectValue placeholder="Seleccione un turno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-11">9–11 am</SelectItem>
                        <SelectItem value="2-4">2–4 pm</SelectItem>
                        <SelectItem value="4-6">4–6 pm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-area">Área de Derecho</Label>
                    <Select
                      value={form.area}
                      onValueChange={set("area")}
                      disabled={isPending}
                    >
                      <SelectTrigger id="asesor-area">
                        <SelectValue placeholder="Seleccione un área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laboral">Laboral</SelectItem>
                        <SelectItem value="familia">Familia</SelectItem>
                        <SelectItem value="penal">Penal</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Asesor"
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
