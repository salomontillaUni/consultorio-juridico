import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FieldProps {
  label: string;
  value: string | number | null | undefined;
  icon?: LucideIcon;
  className?: string;
  valueClassName?: string;
}

export const InfoField = ({
  label,
  value,
  icon: Icon,
  className = "",
  valueClassName = "",
}: FieldProps) => (
  <div className={`space-y-1 ${className}`}>
    <div className="flex items-center text-slate-500 mb-1">
      {Icon && <Icon className="w-3.5 h-3.5 mr-2 opacity-70" />}
      <Label className="text-xs font-bold uppercase tracking-wider">
        {label}
      </Label>
    </div>
    <p
      className={`text-slate-900 font-medium ${Icon ? "pl-5" : ""} ${valueClassName}`}
    >
      {value || "N/A"}
    </p>
  </div>
);

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export const SectionCard = ({
  title,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  children,
  headerActions,
  className = "",
}: SectionCardProps) => (
  <Card
    className={`p-0 overflow-hidden border-slate-200 shadow-sm ${className}`}
  >
    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBgColor} rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      {headerActions && <div>{headerActions}</div>}
    </div>
    <div className="p-6">{children}</div>
  </Card>
);
