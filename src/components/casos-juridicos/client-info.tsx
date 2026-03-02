import React from "react";
import { User, Phone, Mail, MapPin, Smile, DollarSign } from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Check } from "lucide-react";

interface ClientInfoProps {
  usuarios: any;
  isEditing: boolean;
  editedData: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
  canEdit?: boolean;
}

export const ClientInfo = ({
  usuarios,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  canEdit = true,
}: ClientInfoProps) => {
  const headerActions = canEdit ? (
    !isEditing ? (
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
    )
  ) : null;

  return (
    <div className="space-y-6">
      {/* Personal Data */}
      <SectionCard
        title="Datos personales"
        icon={User}
        headerActions={headerActions}
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InfoField
              label="Nombre completo"
              value={usuarios?.nombre_completo}
            />
            <InfoField label="Sexo" value={usuarios?.sexo} />
            <InfoField label="Cédula" value={usuarios?.cedula} />
            <InfoField
              label="Edad"
              value={usuarios?.edad ? `${usuarios.edad} años` : "N/A"}
            />
            <InfoField
              label="Estado civil"
              value={usuarios?.estado_civil}
              valueClassName="capitalize"
            />
            <InfoField
              label="Estrato"
              value={usuarios?.estrato ? `Estrato ${usuarios.estrato}` : "N/A"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">
                Nombre completo
              </Label>
              <Input
                value={editedData?.nombre_completo || ""}
                onChange={(e) => onChange("nombre_completo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Sexo</Label>
              <Select
                value={editedData?.sexo}
                onValueChange={(val) => onChange("sexo", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Cédula</Label>
              <Input
                value={editedData?.cedula || ""}
                onChange={(e) => onChange("cedula", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Edad</Label>
              <Input
                type="number"
                value={editedData?.edad || ""}
                onChange={(e) => onChange("edad", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Estado civil</Label>
              <Select
                value={editedData?.estado_civil || ""}
                onValueChange={(val) => onChange("estado_civil", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soltero">Soltero</SelectItem>
                  <SelectItem value="casado">Casado</SelectItem>
                  <SelectItem value="union libre">Union Libre</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Estrato</Label>
              <Select
                value={editedData?.estrato?.toString()}
                onValueChange={(val) => onChange("estrato", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estrato" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5", "6", "Otro"].map((s) => (
                    <SelectItem key={s} value={s}>
                      Estrato {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Contact Information */}
      <SectionCard
        title="Información de contacto"
        icon={Phone}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <InfoField
                label="Teléfono"
                value={usuarios?.telefono}
                icon={Phone}
              />
              <InfoField
                label="Correo electrónico"
                value={usuarios?.correo}
                icon={Mail}
                valueClassName="text-blue-600"
              />
            </div>
            <div className="space-y-4">
              <InfoField
                label="Dirección"
                value={usuarios?.direccion}
                icon={MapPin}
              />
              <InfoField
                label="Contacto familiar"
                value={usuarios?.contacto_familiar}
                icon={Smile}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Teléfono</Label>
                <Input
                  value={editedData?.telefono || ""}
                  onChange={(e) => onChange("telefono", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Correo electrónico
                </Label>
                <Input
                  value={editedData?.correo || ""}
                  onChange={(e) => onChange("correo", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Dirección</Label>
                <Input
                  value={editedData?.direccion || ""}
                  onChange={(e) => onChange("direccion", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Contacto familiar
                </Label>
                <Input
                  value={editedData?.contacto_familiar || ""}
                  onChange={(e) =>
                    onChange("contacto_familiar", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Labor & Financial Info */}
      <SectionCard
        title="Información laboral y financiera"
        icon={DollarSign}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <InfoField
                label="Situación laboral"
                value={usuarios?.situacion_laboral}
                valueClassName="text-lg font-semibold"
              />
              <InfoField
                label="¿Tiene otros ingresos?"
                value={usuarios?.otros_ingresos ? "Sí" : "No"}
              />
            </div>
            {usuarios?.otros_ingresos && (
              <div className="space-y-6 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <InfoField
                  label="Valor otros ingresos"
                  value={`$${usuarios?.valor_otros_ingresos || "0"}`}
                  valueClassName="text-emerald-900 font-bold text-xl"
                />
                <InfoField
                  label="Concepto"
                  value={usuarios?.concepto_otros_ingresos}
                  valueClassName="text-emerald-800"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Situación laboral
                </Label>
                <Select
                  value={editedData?.situacion_laboral?.toString()}
                  onValueChange={(val) => onChange("situacion_laboral", val)}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Seleccionar situación" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Empleado",
                      "Desempleado",
                      "Independiente",
                      "Pensionado",
                      "Estudiante",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="edit_otros_ingresos"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={editedData?.otros_ingresos || false}
                  onChange={(e) => onChange("otros_ingresos", e.target.checked)}
                />
                <Label
                  htmlFor="edit_otros_ingresos"
                  className="text-slate-700 font-semibold cursor-pointer"
                >
                  Tiene otros ingresos adicionales
                </Label>
              </div>
            </div>

            {editedData?.otros_ingresos && (
              <div className="space-y-5 p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-bold">
                    Valor mensual
                  </Label>
                  <Input
                    type="number"
                    value={editedData?.valor_otros_ingresos || ""}
                    onChange={(e) =>
                      onChange("valor_otros_ingresos", e.target.value)
                    }
                    className="border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-bold">Concepto</Label>
                  <Input
                    value={editedData?.concepto_otros_ingresos || ""}
                    onChange={(e) =>
                      onChange("concepto_otros_ingresos", e.target.value)
                    }
                    className="border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Ej: Arriendos, ventas..."
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
