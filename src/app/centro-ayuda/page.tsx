"use client";

import React from "react";
import { Navbar as StudentNavbar } from "../estudiante/components/NavBarEstudiante";
import { Navbar as AdvisorNavbar } from "../asesor/components/NavBarAsesor";
import { Navbar as ProApoyoNavbar } from "../pro-apoyo/components/NavBarProApoyo";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  Info,
  AlertCircle,
  ShieldCheck,
  Briefcase,
  User,
  Edit,
} from "lucide-react";
import { SectionCard } from "@/components/casos-juridicos/shared-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export default function CentroAyuda() {
  const pathname = usePathname();

  // Choose the navbar based on the current context or user role if possible
  // For now, we'll show a generic one or none if we can't determine the role
  // A better way would be to check the session, but let's keep it simple for now
  const renderNavbar = () => {
    if (pathname.includes("/estudiante")) return <StudentNavbar />;
    if (pathname.includes("/asesor")) return <AdvisorNavbar />;
    if (pathname.includes("/pro-apoyo")) return <ProApoyoNavbar />;
    return null; // Default
  };

  const faqs = [
    {
      question: "¿Cómo registro un nuevo caso?",
      answer:
        "Si eres estudiante, los casos te son asignados por el equipo de Pro-Apoyo. Si eres un solicitante externo, debes acercarte a las instalaciones del Consultorio Jurídico para iniciar el proceso de registro.",
      icon: Briefcase,
    },
    {
      question: "¿Qué debo hacer si mis datos personales están incorrectos?",
      answer:
        "Si encuentras información errónea en tu perfil o en los datos del caso, debes contactar de inmediato con el equipo de Pro-Apoyo. Ellos son los únicos autorizados para realizar modificaciones estructurales en la base de datos de usuarios.",
      icon: User,
      highlight: true,
    },
    {
      question: "¿Cómo puedo ver el estado actual de mi proceso?",
      answer:
        "En la sección 'Mis Casos', cada registro cuenta con una etiqueta de color que indica su estado (Pendiente, En Proceso, Aprobado, Cerrado o Archivado). Al hacer clic en 'Ver detalles' podrás ver una línea de tiempo y observaciones adicionales.",
      icon: Info,
    },
    {
      question: "¿Quién tiene acceso a mi información?",
      answer:
        "La privacidad es nuestra prioridad. Solo tu estudiante asignado, el docente asesor del área y el equipo administrativo de Pro-Apoyo pueden visualizar los detalles de tu caso bajo estrictos acuerdos de confidencialidad.",
      icon: ShieldCheck,
    },
    {
      question: "¿Cómo contacto a mi asesor o estudiante?",
      answer:
        "Dentro de los detalles de cada caso, encontrarás una sección llamada 'Equipo Asignado' con los nombres y correos institucionales de las personas encargadas de tu proceso.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {renderNavbar()}

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más frecuentes sobre el
            funcionamiento del sistema del Consultorio Jurídico.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <SectionCard title="Preguntas Frecuentes" icon={HelpCircle}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-slate-100 last:border-0 py-2"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div
                        className={`p-2 rounded-lg ${faq.highlight ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        <faq.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`font-semibold ${faq.highlight ? "text-slate-900 underline decoration-amber-300 decoration-2 underline-offset-4" : "text-slate-700"}`}
                      >
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed pl-14 pb-4">
                    {faq.answer}
                    {faq.highlight && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 font-medium">
                          Importante: Puedes encontrar al equipo de Pro-Apoyo en
                          la oficina principal del Consultorio o a través de los
                          canales de atención docente.
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionCard>
        </div>

        {/* Support Channels */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="p-3 bg-green-100 rounded-xl">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Soporte Técnico</h3>
              <p className="text-sm text-slate-500">
                Mesa de ayuda: (321) 634-2133
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Correo Institucional</h3>
              <p className="text-sm text-slate-500">
                fabrica.software@uniautonoma.edu.co
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-slate-400 text-sm">
          <p>© 2026 Consultorio Jurídico - Universidad Autónoma del Cauca</p>
          <p className="mt-1">Sistema de Gestión de Casos v2.0</p>
        </div>
      </main>
    </div>
  );
}
