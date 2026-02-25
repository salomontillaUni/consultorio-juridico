'use client';
import { Users, UserPlus, GraduationCap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "../components/NavbarAdmin";
import { useRouter } from "next/navigation";

export default function AdminPanelPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <Navbar />
            <main className="flex-1 bg-gray-50 p-8">
                <div className="mb-6">
                    <h1 className="text-gray-900 mb-2">Panel Administrativo</h1>
                    <p className="text-gray-600">
                        Gestiona estudiantes, profesionales de apoyo y asesores del consultorio jurídico.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => router.push('/admin/estudiantes')}
                    >
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

                    <Card
                        className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => router.push('/admin/proapoyo')}
                    >
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

                    <Card
                        className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => router.push('/admin/asesores')}
                    >
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
            </main>
        </div>
    );
}