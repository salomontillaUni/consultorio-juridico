import React from "react";
import { UserX, Phone, Mail, MapPin, IdCard, Edit3, Check } from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DefendantInfoProps {
  defendantData: any;
  isEditing: boolean;
  editedData: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
  canEdit?: boolean;
}

export const DefendantInfo = ({
  defendantData,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  canEdit = true,
}: DefendantInfoProps) => {
  const headerActions = canEdit ? (
    !isEditing ? (
      <Button
        onClick={onEdit}
        size="sm"
        variant="ghost"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
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
    )
  ) : null;

  return (
    <SectionCard
      title="Información del demandado"
      icon={UserX}
      iconBgColor="bg-red-100"
      iconColor="text-red-600"
      headerActions={headerActions}
    >
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-6">
            <InfoField
              label="Nombre completo"
              value={defendantData?.nombre_completo || "No registrado"}
              icon={UserX}
              valueClassName="text-lg font-semibold"
            />
            <InfoField
              label="Documento / NIT"
              value={defendantData?.documento || "Sin documento"}
              icon={IdCard}
            />
            <InfoField
              label="Celular"
              value={defendantData?.celular || "No disponible"}
              icon={Phone}
            />
          </div>
          <div className="space-y-6">
            <InfoField
              label="Lugar de residencia"
              value={
                defendantData?.lugar_residencia || "Dirección no registrada"
              }
              icon={MapPin}
              valueClassName="leading-relaxed"
            />
            <InfoField
              label="Correo electrónico"
              value={defendantData?.correo || "Sin correo"}
              icon={Mail}
              valueClassName="text-blue-600 break-all"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2">
                <UserX className="w-4 h-4 text-slate-400" />
                Nombre completo
              </Label>
              <Input
                value={editedData?.nombre_completo || ""}
                onChange={(e) => onChange("nombre_completo", e.target.value)}
                placeholder="Nombre o razón social"
                className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2">
                <IdCard className="w-4 h-4 text-slate-400" />
                Documento
              </Label>
              <Input
                value={editedData?.documento || ""}
                onChange={(e) => onChange("documento", e.target.value)}
                placeholder="NIT, CC, etc."
                className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Celular
              </Label>
              <Input
                value={editedData?.celular || ""}
                onChange={(e) => onChange("celular", e.target.value)}
                placeholder="+57 321 ..."
                className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
              />
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                Lugar de residencia
              </Label>
              <Textarea
                value={editedData?.lugar_residencia || ""}
                onChange={(e) => onChange("lugar_residencia", e.target.value)}
                placeholder="Dirección completa"
                className="min-h-24 border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Correo electrónico
              </Label>
              <Input
                type="email"
                value={editedData?.correo || ""}
                onChange={(e) => onChange("correo", e.target.value)}
                placeholder="correo@ejemplo.com"
                className="border-slate-200 focus:ring-red-500/20 focus:border-red-500 rounded-lg h-11"
              />
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
};
