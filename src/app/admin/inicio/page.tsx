'use client';

import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  PlusCircle,
  Calendar,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "../components/NavbarAdmin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPanelPage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleDateString('es-CO', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            }));
        };
        updateTime();
    }, []);


    const actions = [
        {
            title: "Registro Estudiantes",
            desc: "Añadir nuevos estudiantes al consultorio",
            href: "/admin/estudiantes",
            icon: GraduationCap,
            color: "blue",
            btnText: "Configurar Estudiante"
        },
        {
            title: "Registro Profesionales",
            desc: "Gestionar personal de apoyo jurídico",
            href: "/admin/proapoyo",
            icon: UserPlus,
            color: "emerald",
            btnText: "Añadir Profesional"
        },
        {
            title: "Registro Asesores",
            desc: "Asignar nuevos asesores docentes",
            href: "/admin/asesores",
            icon: Users,
            color: "purple",
            btnText: "Asignar Asesor"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Calendar className="w-4 h-4 uppercase" />
                            <span className="text-xs font-semibold uppercase tracking-wider">{currentTime}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido, Administrador</h1>
                        <p className="text-slate-500 mt-1">Aquí tienes un resumen de la actividad del consultorio jurídico.</p>
                    </div>
                    
                </div>

                

                {/* Main Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {actions.map((action, i) => {
                        const colorStyles = {
                            blue: "bg-blue-500 hover:bg-blue-600 shadow-blue-100",
                            emerald: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100",
                            purple: "bg-purple-500 hover:bg-purple-600 shadow-purple-100",
                        };
                        const colorSet = action.color as keyof typeof colorStyles;

                        return (
                            <div 
                                key={i}
                                onClick={() => router.push(action.href)}
                                className="group relative cursor-pointer"
                            >
                                <div className={`absolute inset-0 ${colorStyles[colorSet]} rounded-3xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                
                                <Card className="relative h-full border border-slate-200/60 bg-white/80 backdrop-blur-xl hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm">
                                    <div className={`h-1.5 w-full ${colorStyles[colorSet].split(' ')[0]}`} />
                                    <CardHeader className="pt-8 px-8">
                                        <div className={`aspect-square w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 mb-4`}>
                                            <action.icon className="w-7 h-7 text-slate-700" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{action.title}</CardTitle>
                                        <CardDescription className="text-slate-500 leading-relaxed text-base">
                                            {action.desc}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 pt-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all duration-300">
                                            <span>{action.btnText}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>

        
            </main>
        </div>
    );
}