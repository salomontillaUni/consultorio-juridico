'use client'
import { useState } from "react";
import { Users, UserPlus, GraduationCap, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Navbar } from "../components/NavbarAdmin";
import { useRouter } from "next/navigation";

type SectionType = "dashboard" | "students" | "support" | "advisors";



interface SupportForm {
    nombre: string;
    correo: string;
    cedula: string;
    telefono: string;
}

interface AdvisorForm {
    nombre: string;
    correo: string;
    cedula: string;
    telefono: string;
    turno: string;
    area: string;
}

export default function AdminPanelPage() {
    const [activeSection, setActiveSection] = useState<SectionType>("dashboard");
    const router = useRouter();

    const [supportForm, setSupportForm] = useState<SupportForm>({
        nombre: "",
        correo: "",
        cedula: "",
        telefono: "",
    });

    const [advisorForm, setAdvisorForm] = useState<AdvisorForm>({
        nombre: "",
        correo: "",
        cedula: "",
        telefono: "",
        turno: "",
        area: "",
    });

    

    // Handle support professional registration
    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!supportForm.nombre || !supportForm.correo || !supportForm.cedula || !supportForm.telefono) {
            toast.error("Por favor complete todos los campos");
            return;
        }

        toast.success("Profesional de apoyo registrado exitosamente");
        setSupportForm({
            nombre: "",
            correo: "",
            cedula: "",
            telefono: "",
        });
    };

    // Handle advisor registration
    const handleAdvisorSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!advisorForm.nombre || !advisorForm.correo || !advisorForm.cedula ||
            !advisorForm.telefono || !advisorForm.turno || !advisorForm.area) {
            toast.error("Por favor complete todos los campos");
            return;
        }

        toast.success("Asesor registrado exitosamente");
        setAdvisorForm({
            nombre: "",
            correo: "",
            cedula: "",
            telefono: "",
            turno: "",
            area: "",
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <Navbar />
            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-8">

                {/* Dashboard */}
                {activeSection === "dashboard" && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-gray-900 mb-2">Panel Administrativo</h1>
                            <p className="text-gray-600">
                                Gestiona estudiantes, profesionales de apoyo y asesores del consultorio jurídico.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => router.push('/admin/estudiantes')}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <GraduationCap className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Estudiantes</CardTitle>
                                            <CardDescription>Registrar nuevos estudiantes</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => setActiveSection("support")}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <UserPlus className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Profesionales</CardTitle>
                                            <CardDescription>Registrar profesionales de apoyo</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => setActiveSection("advisors")}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Asesores</CardTitle>
                                            <CardDescription>Registrar docentes asesores</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                )}

                                {/* Agregar Profesionales de Apoyo */}
                {activeSection === "support" && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-gray-900 mb-2">Agregar Profesional de Apoyo</h1>
                            <p className="text-gray-600">
                                Registra nuevos profesionales de apoyo en el sistema.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Profesional</CardTitle>
                                <CardDescription>Complete todos los campos requeridos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSupportSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="support-nombre">Nombre Completo</Label>
                                            <Input
                                                id="support-nombre"
                                                placeholder="Ingrese el nombre completo"
                                                value={supportForm.nombre}
                                                onChange={(e) => setSupportForm({ ...supportForm, nombre: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="support-correo">Correo Electrónico</Label>
                                            <Input
                                                id="support-correo"
                                                type="email"
                                                placeholder="ejemplo@correo.com"
                                                value={supportForm.correo}
                                                onChange={(e) => setSupportForm({ ...supportForm, correo: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="support-cedula">Cédula</Label>
                                            <Input
                                                id="support-cedula"
                                                placeholder="Número de cédula"
                                                value={supportForm.cedula}
                                                onChange={(e) => setSupportForm({ ...supportForm, cedula: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="support-telefono">Teléfono</Label>
                                            <Input
                                                id="support-telefono"
                                                placeholder="Número de teléfono"
                                                value={supportForm.telefono}
                                                onChange={(e) => setSupportForm({ ...supportForm, telefono: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg">
                                            Registrar Profesional
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Agregar Asesores */}
                {activeSection === "advisors" && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-gray-900 mb-2">Agregar Asesor</h1>
                            <p className="text-gray-600">
                                Registra nuevos docentes asesores en el sistema.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Asesor</CardTitle>
                                <CardDescription>Complete todos los campos requeridos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAdvisorSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="advisor-nombre">Nombre Completo</Label>
                                            <Input
                                                id="advisor-nombre"
                                                placeholder="Ingrese el nombre completo"
                                                value={advisorForm.nombre}
                                                onChange={(e) => setAdvisorForm({ ...advisorForm, nombre: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="advisor-correo">Correo Electrónico</Label>
                                            <Input
                                                id="advisor-correo"
                                                type="email"
                                                placeholder="ejemplo@correo.com"
                                                value={advisorForm.correo}
                                                onChange={(e) => setAdvisorForm({ ...advisorForm, correo: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="advisor-cedula">Cédula</Label>
                                            <Input
                                                id="advisor-cedula"
                                                placeholder="Número de cédula"
                                                value={advisorForm.cedula}
                                                onChange={(e) => setAdvisorForm({ ...advisorForm, cedula: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="advisor-telefono">Teléfono</Label>
                                            <Input
                                                id="advisor-telefono"
                                                placeholder="Número de teléfono"
                                                value={advisorForm.telefono}
                                                onChange={(e) => setAdvisorForm({ ...advisorForm, telefono: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="advisor-turno">Turno</Label>
                                            <Select value={advisorForm.turno} onValueChange={(value) => setAdvisorForm({ ...advisorForm, turno: value })}>
                                                <SelectTrigger id="advisor-turno" className="rounded-lg">
                                                    <SelectValue placeholder="Seleccione un turno" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="9-11">9–11</SelectItem>
                                                    <SelectItem value="2-4">2–4</SelectItem>
                                                    <SelectItem value="4-6">4–6</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="advisor-area">Área</Label>
                                            <Select value={advisorForm.area} onValueChange={(value) => setAdvisorForm({ ...advisorForm, area: value })}>
                                                <SelectTrigger id="advisor-area" className="rounded-lg">
                                                    <SelectValue placeholder="Seleccione un área" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Laboral">Laboral</SelectItem>
                                                    <SelectItem value="Familia">Familia</SelectItem>
                                                    <SelectItem value="Penal">Penal</SelectItem>
                                                    <SelectItem value="Civil">Civil</SelectItem>
                                                    <SelectItem value="Otros">Otros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg">
                                            Registrar Asesor
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}