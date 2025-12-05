"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

import { toast } from "sonner";
import { Navbar } from "../components/NavbarAdmin";
interface StudentForm {
    nombre: string;
    correo: string;
    cedula: string;
    telefono: string;
    semestre: string;
    jornada: string;
    turno: string;
}
export default function EstudiantesPage() {

    // Form states
    const [studentForm, setStudentForm] = useState<StudentForm>({
        nombre: "",
        correo: "",
        cedula: "",
        telefono: "",
        semestre: "",
        jornada: "",
        turno: "",
    });

    // Handle student registration
    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!studentForm.nombre || !studentForm.correo || !studentForm.cedula || !studentForm.telefono ||
            !studentForm.semestre || !studentForm.jornada || !studentForm.turno) {
            toast.error("Por favor complete todos los campos");
            return;
        }

        toast.success("Estudiante registrado exitosamente");
        setStudentForm({
            nombre: "",
            correo: "",
            cedula: "",
            telefono: "",
            semestre: "",
            jornada: "",
            turno: "",
        });
    };
    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-gray-900 mb-2">Agregar Estudiante</h1>
                    <p className="text-gray-600">
                        Registra nuevos estudiantes en el sistema del consultorio jurídico.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Estudiante</CardTitle>
                        <CardDescription>Complete todos los campos requeridos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleStudentSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="student-nombre">Nombre Completo</Label>
                                    <Input
                                        id="student-nombre"
                                        placeholder="Ingrese el nombre completo"
                                        value={studentForm.nombre}
                                        onChange={(e) => setStudentForm({ ...studentForm, nombre: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student-correo">Correo Electrónico</Label>
                                    <Input
                                        id="student-correo"
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        value={studentForm.correo}
                                        onChange={(e) => setStudentForm({ ...studentForm, correo: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student-cedula">Cédula</Label>
                                    <Input
                                        id="student-cedula"
                                        placeholder="Número de cédula"
                                        value={studentForm.cedula}
                                        onChange={(e) => setStudentForm({ ...studentForm, cedula: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student-telefono">Teléfono</Label>
                                    <Input
                                        id="student-telefono"
                                        placeholder="Número de teléfono"
                                        value={studentForm.telefono}
                                        onChange={(e) => setStudentForm({ ...studentForm, telefono: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student-semestre">Semestre</Label>
                                    <Input
                                        id="student-semestre"
                                        type="number"
                                        placeholder="Número de semestre"
                                        value={studentForm.semestre}
                                        onChange={(e) => setStudentForm({ ...studentForm, semestre: e.target.value })}
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student-jornada">Jornada</Label>
                                    <Select value={studentForm.jornada} onValueChange={(value) => setStudentForm({ ...studentForm, jornada: value })}>
                                        <SelectTrigger id="student-jornada" className="rounded-lg">
                                            <SelectValue placeholder="Seleccione una jornada" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Diurno">Diurno</SelectItem>
                                            <SelectItem value="Nocturno">Nocturno</SelectItem>
                                            <SelectItem value="Mixto">Mixto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student-turno">Turno</Label>
                                    <Select value={studentForm.turno} onValueChange={(value) => setStudentForm({ ...studentForm, turno: value })}>
                                        <SelectTrigger id="student-turno" className="rounded-lg">
                                            <SelectValue placeholder="Seleccione un turno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="9-11">9–11</SelectItem>
                                            <SelectItem value="2-4">2–4</SelectItem>
                                            <SelectItem value="4-6">4–6</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg">
                                    Registrar Estudiante
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>

        </div>
    )
}