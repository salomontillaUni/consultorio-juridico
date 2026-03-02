import React from "react";
import { UserCheck, IdCard, Mail, Briefcase, Clock, Phone } from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Label } from "@/components/ui/label";

interface AdvisorInfoProps {
  advisors: any[] | null;
  isEditing?: boolean;
}

export const AdvisorInfo = ({
  advisors,
  isEditing = false,
}: AdvisorInfoProps) => {
  if (!advisors || advisors.length === 0) {
    return (
      <div className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-2xl">
        <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium italic">
          No hay asesores asignados a este caso.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {advisors.map((advisor, index) => (
        <SectionCard
          key={advisor.id_perfil || index}
          title={`Asesor Docente ${advisors.length > 1 ? index + 1 : ""}`}
          icon={UserCheck}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InfoField
              label="Nombre completo"
              value={advisor.perfil?.nombre_completo}
              icon={UserCheck}
              valueClassName="font-semibold"
            />
            <InfoField
              label="Cédula"
              value={advisor.perfil?.cedula}
              icon={IdCard}
            />
            <InfoField
              label="Correo electrónico"
              value={advisor.perfil?.correo}
              icon={Mail}
              valueClassName="text-blue-600"
            />
            <InfoField
              label="Área de especialidad"
              value={advisor.area || "N/A"}
              icon={Briefcase}
              className="capitalize"
            />
            <InfoField
              label="Turno"
              value={advisor.turno || "N/A"}
              icon={Clock}
            />
            <InfoField
              label="Teléfono"
              value={advisor.perfil?.telefono || "No registrado"}
              icon={Phone}
            />
          </div>
        </SectionCard>
      ))}
    </div>
  );
};
