import React from "react";
import {
  Users,
  IdCard,
  Mail,
  GraduationCap,
  Clock,
  Phone,
  Calendar,
} from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentInfoProps {
  students: any[] | null;
  isEditing: boolean;
  onDataChange: (index: number, field: string, value: string) => void;
}

export const StudentInfo = ({
  students,
  isEditing,
  onDataChange,
}: StudentInfoProps) => {
  if (!students || students.length === 0) {
    return (
      <div className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-2xl">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium italic">
          No hay estudiantes asignados a este caso.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {students.map((student, index) => (
        <SectionCard
          key={student.id_perfil || index}
          title={`Estudiante ${students.length > 1 ? index + 1 : ""}`}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        >
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              <InfoField
                label="Nombre completo"
                value={student.perfil?.nombre_completo}
                icon={Users}
                valueClassName="font-semibold"
              />
              <InfoField
                label="Cédula"
                value={student.perfil?.cedula}
                icon={IdCard}
              />
              <InfoField
                label="Correo electrónico"
                value={student.perfil?.correo}
                icon={Mail}
                valueClassName="text-blue-600"
              />
              <InfoField
                label="Semestre"
                value={
                  student.semestre ? `${student.semestre}° Semestre` : "N/A"
                }
                icon={GraduationCap}
              />
              <InfoField
                label="Jornada"
                value={student.jornada}
                icon={Clock}
                className="capitalize"
              />
              <InfoField label="Turno" value={student.turno} icon={Calendar} />
              <InfoField
                label="Teléfono"
                value={student.perfil?.telefono || "No registrado"}
                icon={Phone}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Nombre completo
                </Label>
                <Input
                  value={student.perfil?.nombre_completo || ""}
                  onChange={(e) =>
                    onDataChange(
                      index,
                      "perfil.nombre_completo",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Cédula</Label>
                <Input
                  value={student.perfil?.cedula || ""}
                  onChange={(e) =>
                    onDataChange(index, "perfil.cedula", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Correo electrónico
                </Label>
                <Input
                  type="email"
                  value={student.perfil?.correo || ""}
                  onChange={(e) =>
                    onDataChange(index, "perfil.correo", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Semestre</Label>
                <Select
                  value={student.semestre?.toString()}
                  onValueChange={(val) => onDataChange(index, "semestre", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Jornada</Label>
                <Select
                  value={student.jornada || ""}
                  onValueChange={(val) => onDataChange(index, "jornada", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Jornada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diurna">Diurna</SelectItem>
                    <SelectItem value="nocturna">Nocturna</SelectItem>
                    <SelectItem value="mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Turno</Label>
                <Select
                  value={student.turno || ""}
                  onValueChange={(val) => onDataChange(index, "turno", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-11">9-11</SelectItem>
                    <SelectItem value="2-4">2-4</SelectItem>
                    <SelectItem value="4-6">4-6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Teléfono</Label>
                <Input
                  value={student.perfil?.telefono || ""}
                  onChange={(e) =>
                    onDataChange(index, "perfil.telefono", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  );
};
