"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/NavbarAdmin";
import { registerEstudiante } from "../actions/registerUser";
import {
  toggleUserStatus,
  deleteUser,
  updateEstudiante,
} from "../actions/userActions";
import { getEstudiantes } from "../../../../supabase/queries/getEstudiantes";
import type { JornadaEnum, TurnoEnum, Estudiante } from "../../types/database";
import {
  GraduationCap,
  Loader2,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Search,
  ChartNoAxesColumnDecreasingIcon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface StudentForm {
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  semestre: string;
  jornada: JornadaEnum | "";
  turno: TurnoEnum | "";
}

const EMPTY_FORM: StudentForm = {
  nombre: "",
  correo: "",
  cedula: "",
  telefono: "",
  semestre: "",
  jornada: "",
  turno: "",
};

export default function EstudiantesPage() {
  const [form, setForm] = useState<StudentForm>(EMPTY_FORM);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Edit State
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null);
  const [editForm, setEditForm] = useState<StudentForm>(EMPTY_FORM);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function fetchEstudiantes() {
    setLoading(true);
    const data = await getEstudiantes();
    setEstudiantes(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const set = (field: keyof StudentForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setEdit = (field: keyof StudentForm) => (value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.correo ||
      !form.cedula ||
      !form.telefono ||
      !form.semestre ||
      !form.jornada ||
      !form.turno
    ) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }

    const semestre = parseInt(form.semestre, 10);
    if (isNaN(semestre) || semestre < 1 || semestre > 10) {
      toast.error("El semestre debe ser un número entre 1 y 10.");
      return;
    }

    startTransition(async () => {
      const result = await registerEstudiante({
        nombre_completo: form.nombre,
        correo: form.correo,
        cedula: form.cedula,
        telefono: form.telefono,
        semestre,
        jornada: form.jornada as JornadaEnum,
        turno: form.turno as TurnoEnum,
      });

      if (result.success) {
        toast.success(result.message);
        setForm(EMPTY_FORM);
        fetchEstudiantes();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleToggleStatus = async (student: Estudiante) => {
    const result = await toggleUserStatus(
      student.id_perfil,
      student.perfil.activo,
    );
    if (result.success) {
      toast.success(result.message);
      fetchEstudiantes();
    } else {
      toast.error(result.error);
    }
  };

  const openEdit = (student: Estudiante) => {
    setEditingStudent(student);
    setEditForm({
      nombre: student.perfil.nombre_completo,
      correo: student.perfil.correo || "",
      cedula: student.perfil.cedula || "",
      telefono: student.perfil.telefono || "",
      semestre: student.semestre.toString(),
      jornada: student.jornada,
      turno: student.turno,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;

    startTransition(async () => {
      const result = await updateEstudiante(editingStudent.id_perfil, {
        nombre_completo: editForm.nombre,
        cedula: editForm.cedula,
        telefono: editForm.telefono,
        semestre: parseInt(editForm.semestre),
        jornada: editForm.jornada,
        turno: editForm.turno,
      });

      if (result.success) {
        toast.success(result.message);
        setIsEditOpen(false);
        fetchEstudiantes();
        
      } else {
        toast.error(result.error);
      }
    });
  };

  const filteredEstudiantes = estudiantes.filter(
    (e) =>
      e.perfil.nombre_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      e.perfil.cedula?.includes(searchTerm) ||
      e.perfil.correo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Register Form */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Registrar</h1>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Nuevo Estudiante</CardTitle>
                <CardDescription className="text-xs">
                  Todos los campos son obligatorios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="student-nombre" className="text-xs">
                      Nombre Completo
                    </Label>
                    <Input
                      id="student-nombre"
                      placeholder="María García López"
                      value={form.nombre}
                      onChange={(e) => set("nombre")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="student-correo" className="text-xs">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="student-correo"
                      type="email"
                      placeholder="estudiante@uac.edu.co"
                      value={form.correo}
                      onChange={(e) => set("correo")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="student-cedula" className="text-xs">
                        Cédula
                      </Label>
                      <Input
                        id="student-cedula"
                        placeholder="C.C."
                        value={form.cedula}
                        onChange={(e) => set("cedula")(e.target.value)}
                        disabled={isPending}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="student-telefono" className="text-xs">
                        Teléfono
                      </Label>
                      <Input
                        id="student-telefono"
                        placeholder="300..."
                        value={form.telefono}
                        onChange={(e) => set("telefono")(e.target.value)}
                        disabled={isPending}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="student-semestre" className="text-xs">
                        Sem.
                      </Label>
                      <Input
                        id="student-semestre"
                        type="number"
                        min={1}
                        max={10}
                        value={form.semestre}
                        onChange={(e) => set("semestre")(e.target.value)}
                        disabled={isPending}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label htmlFor="student-jornada" className="text-xs">
                        Jornada
                      </Label>
                      <Select
                        value={form.jornada}
                        onValueChange={set("jornada")}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diurna">Diurna</SelectItem>
                          <SelectItem value="nocturna">Nocturna</SelectItem>
                          <SelectItem value="mixto">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="student-turno" className="text-xs">
                      Turno Horario
                    </Label>
                    <Select
                      value={form.turno}
                      onValueChange={set("turno")}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Seleccione turno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-11">9–11 am</SelectItem>
                        <SelectItem value="2-4">2–4 pm</SelectItem>
                        <SelectItem value="4-6">4–6 pm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
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
                Estudiantes Registrados
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar estudiante..."
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
                      <TableHead>Semestre / Turno</TableHead>
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
                          Cargando estudiantes...
                        </TableCell>
                      </TableRow>
                    ) : filteredEstudiantes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-41 text-center text-slate-500"
                        >
                          No se encontraron estudiantes.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEstudiantes.map((student) => (
                        <TableRow key={student.id_perfil}>
                          <TableCell>
                            <div className="font-medium text-slate-900">
                              {student.perfil.nombre_completo}
                            </div>
                            <div className="text-xs text-slate-500">
                              CC: {student.perfil.cedula}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              Semestre {student.semestre}
                            </div>
                            <div className="text-xs text-slate-400 capitalize">
                              {student.jornada} • {student.turno}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.perfil.activo ? "default" : "destructive"}>
                              {student.perfil.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => openEdit(student)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 ${student.perfil.activo ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}`}
                                onClick={() => handleToggleStatus(student)}
                              >
                                {student.perfil.activo ? (
                                  <PowerOff className="h-4 w-4" />
                                ) : (
                                  <Power className="h-4 w-4" />
                                )}
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
              <DialogTitle>Editar Estudiante</DialogTitle>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-semestre" className="text-right">
                  Semestre
                </Label>
                <Input
                  id="edit-semestre"
                  type="number"
                  value={editForm.semestre}
                  onChange={(e) => setEdit("semestre")(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-jornada" className="text-right">
                  Jornada
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.jornada}
                    onValueChange={setEdit("jornada")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione jornada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diurna">Diurna</SelectItem>
                      <SelectItem value="nocturna">Nocturna</SelectItem>
                      <SelectItem value="mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-turno" className="text-right">
                  Turno
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.turno}
                    onValueChange={setEdit("turno")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9-11">9–11 am</SelectItem>
                      <SelectItem value="2-4">2–4 pm</SelectItem>
                      <SelectItem value="4-6">4–6 pm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
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
