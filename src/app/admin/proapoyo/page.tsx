"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/NavbarAdmin";
import { registerProApoyo } from "../actions/registerUser";
import {
  toggleUserStatus,
  deleteUser,
  updateProApoyo,
} from "../actions/userActions";
import { getProApoyo } from "../../../../supabase/queries/getProApoyo";
import {
  UserPlus,
  Loader2,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Search,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Edit State
  const [editingPro, setEditingPro] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<ProApoyoForm>(EMPTY_FORM);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function fetchProfesionales() {
    setLoading(true);
    const data = await getProApoyo();
    setProfesionales(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const set = (field: keyof ProApoyoForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setEdit = (field: keyof ProApoyoForm) => (value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

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
        fetchProfesionales();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleToggleStatus = async (pro: any) => {
    const result = await toggleUserStatus(pro.id_perfil, pro.perfil.activo);
    if (result.success) {
      toast.success(result.message);
      fetchProfesionales();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (pro: any) => {
    if (
      !confirm(
        `¿Está seguro de eliminar al profesional ${pro.perfil.nombre_completo}? Esta acción no se puede deshacer.`,
      )
    )
      return;

    const result = await deleteUser(pro.id_perfil, "pro_apoyo");
    if (result.success) {
      toast.success(result.message);
      fetchProfesionales();
    } else {
      toast.error(result.error);
    }
  };

  const openEdit = (pro: any) => {
    setEditingPro(pro);
    setEditForm({
      nombre: pro.perfil.nombre_completo,
      correo: pro.perfil.correo || "",
      cedula: pro.perfil.cedula || "",
      telefono: pro.perfil.telefono || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPro) return;

    startTransition(async () => {
      const result = await updateProApoyo(editingPro.id_perfil, {
        nombre_completo: editForm.nombre,
        cedula: editForm.cedula,
        telefono: editForm.telefono,
      });

      if (result.success) {
        toast.success(result.message);
        setIsEditOpen(false);
        fetchProfesionales();
      } else {
        toast.error(result.error);
      }
    });
  };

  const filteredProfesionales = profesionales.filter(
    (p) =>
      p.perfil.nombre_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.perfil.cedula?.includes(searchTerm) ||
      p.perfil.correo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Register Form */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Registrar</h1>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Nuevo Profesional</CardTitle>
                <CardDescription className="text-xs">
                  Todos los campos son obligatorios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-nombre" className="text-xs">
                      Nombre Completo
                    </Label>
                    <Input
                      id="proapoyo-nombre"
                      placeholder="Ana Martínez Pérez"
                      value={form.nombre}
                      onChange={(e) => set("nombre")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-correo" className="text-xs">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="proapoyo-correo"
                      type="email"
                      placeholder="profesional@uac.edu.co"
                      value={form.correo}
                      onChange={(e) => set("correo")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-cedula" className="text-xs">
                      Cédula
                    </Label>
                    <Input
                      id="proapoyo-cedula"
                      placeholder="Número de cédula"
                      value={form.cedula}
                      onChange={(e) => set("cedula")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proapoyo-telefono" className="text-xs">
                      Teléfono
                    </Label>
                    <Input
                      id="proapoyo-telefono"
                      placeholder="Ej: 3001234567"
                      value={form.telefono}
                      onChange={(e) => set("telefono")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: List & CRUD */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Profesionales Registrados
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar profesional..."
                  className="pl-9 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Nombre / Cédula</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-48 text-center text-slate-500"
                        >
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          Cargando profesionales...
                        </TableCell>
                      </TableRow>
                    ) : filteredProfesionales.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-41 text-center text-slate-500"
                        >
                          No se encontraron profesionales de apoyo.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfesionales.map((pro) => (
                        <TableRow key={pro.id_perfil}>
                          <TableCell>
                            <div className="font-medium text-slate-900">
                              {pro.perfil.nombre_completo}
                            </div>
                            <div className="text-xs text-slate-500">
                              CC: {pro.perfil.cedula}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{pro.perfil.correo}</div>
                            <div className="text-xs text-slate-400">
                              {pro.perfil.telefono}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                pro.perfil.activo ? "secondary" : "destructive"
                              }
                            >
                              {pro.perfil.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => openEdit(pro)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 ${pro.perfil.activo ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}`}
                                onClick={() => handleToggleStatus(pro)}
                              >
                                {pro.perfil.activo ? (
                                  <PowerOff className="h-4 w-4" />
                                ) : (
                                  <Power className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(pro)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Profesional</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEdit("nombre")(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cedula" className="text-right">
                  Cédula
                </Label>
                <Input
                  id="edit-cedula"
                  value={editForm.cedula}
                  onChange={(e) => setEdit("cedula")(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-telefono"
                  value={editForm.telefono}
                  onChange={(e) => setEdit("telefono")(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleUpdate}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
