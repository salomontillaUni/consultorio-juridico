import React from "react";
import {
  FileText,
  Briefcase,
  Activity,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Check,
} from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CaseInfoTabProps {
  caseData: any;
  isEditing: boolean;
  editedData: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export const CaseInfoTab = ({
  caseData,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  getStatusBadge,
}: CaseInfoTabProps) => {
  const headerActions = !isEditing ? (
    <Button
      onClick={onEdit}
      size="sm"
      variant="ghost"
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
    >
      <Edit3 className="w-4 h-4 mr-2" />
      Modificar
    </Button>
  ) : (
    <div className="flex gap-2">
      <Button
        onClick={onSave}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        <Check className="w-4 h-4 mr-2" />
        Guardar
      </Button>
      <Button
        onClick={onCancel}
        size="sm"
        variant="ghost"
        className="text-slate-600 hover:bg-slate-100 font-semibold"
      >
        Cancelar
      </Button>
    </div>
  );

  return (
    <SectionCard
      title="Información del caso"
      icon={FileText}
      headerActions={headerActions}
    >
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <InfoField
            label="Tipo de caso"
            value={caseData?.area}
            icon={Briefcase}
            valueClassName="capitalize text-lg font-semibold"
          />

          <div className="space-y-1">
            <div className="flex items-center text-slate-500 mb-1">
              <Activity className="w-4 h-4 mr-2 opacity-70" />
              <Label className="text-xs font-bold uppercase tracking-wider">
                Estado del caso
              </Label>
            </div>
            <div className="pl-6 pt-1">
              {caseData && getStatusBadge(caseData.estado)}
            </div>
          </div>

          <InfoField
            label="Tipo de proceso"
            value={caseData?.tipo_proceso}
            icon={ClipboardList}
          />

          <div className="space-y-1">
            <div className="flex items-center text-slate-500 mb-1">
              <ShieldCheck className="w-4 h-4 mr-2 opacity-70" />
              <Label className="text-xs font-bold uppercase tracking-wider">
                Aprobación Asesor
              </Label>
            </div>
            <div className="pl-6 pt-1">
              {caseData?.aprobacion_asesor ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-bold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  APROBADO
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-slate-200 text-slate-400 font-bold px-3 py-1 uppercase"
                >
                  Pendiente
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-slate-400" />
                Tipo de caso
              </Label>
              <Select
                value={editedData?.area || ""}
                onValueChange={(val) => onChange("area", val)}
              >
                <SelectTrigger className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11">
                  <SelectValue placeholder="Seleccionar tipo de caso" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {["laboral", "civil", "penal", "familia", "otros"].map(
                    (area) => (
                      <SelectItem
                        key={area}
                        value={area}
                        className="focus:bg-blue-50 focus:text-blue-700 capitalize"
                      >
                        {area}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2 mb-1">
                <ClipboardList className="w-4 h-4 text-slate-400" />
                Tipo de proceso
              </Label>
              <Input
                value={editedData?.tipo_proceso || ""}
                onChange={(e) => onChange("tipo_proceso", e.target.value)}
                placeholder="Ej: Ordinario, Ejecutivo..."
                className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11"
              />
            </div>
          </div>
          {/* Add more editing fields if needed */}
        </div>
      )}
    </SectionCard>
  );
};
