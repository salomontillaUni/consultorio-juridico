import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendiente_aprobacion: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      text: "Pendiente de aprobación",
    },
    aprobado: {
      color: "bg-green-50 text-green-700 border-green-200",
      text: "Aprobado",
    },
    en_proceso: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      text: "En proceso",
    },
    cerrado: {
      color: "bg-slate-50 text-slate-700 border-slate-200",
      text: "Cerrado",
    },
    archivado: {
      color: "bg-red-50 text-red-700 border-red-200",
      text: "Archivado",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig.en_proceso;
  return (
    <Badge
      variant="outline"
      className={`${config.color} font-medium tracking-tight rounded-full px-3 py-1`}
    >
      {config.text}
    </Badge>
  );
};
