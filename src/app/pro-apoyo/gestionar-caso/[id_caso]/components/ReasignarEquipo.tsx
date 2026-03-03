"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getEstudiantes } from "../../../../../../supabase/queries/getEstudiantes";
import { getAsesores } from "../../../../../../supabase/queries/getAsesores";
import { insertEstudiantesCasos } from "../../../../../../supabase/queries/insertEstudiantesCasos";
import { insertAsesoresCasos } from "../../../../../../supabase/queries/insertAsesoresCasos";
import { SearchableSelector } from "@/components/SearchableSelector";
import { toast } from "sonner";
import { EstudianteCaso, AsesorCaso } from "app/types/database";

interface Props {
  idCaso: string;
  type: "estudiante" | "asesor";
  casosData: any[];
  onRefresh: () => void;
}

export function ReasignarEquipo({ idCaso, type, casosData, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (type === "estudiante") {
        getEstudiantes().then((res) => {
          if (res) setItems(res);
        });
      } else {
        getAsesores().then((res) => {
          if (res) setItems(res);
        });
      }
    } else {
      setSelectedId(""); // reset on close
    }
  }, [open, type]);

  const handleReassign = async () => {
    if (!selectedId) return;

    // Validation to avoid reassigning the same person
    const currentId =
      type === "estudiante"
        ? current?.estudiante?.id_perfil?.toString()
        : current?.asesor?.id_perfil?.toString();

    if (selectedId === currentId) {
      toast.error(
        `Este ${type === "estudiante" ? "estudiante" : "asesor"} ya está asignado actualmente al caso.`,
      );
      return;
    }

    setLoading(true);
    try {
      if (type === "estudiante") {
        await insertEstudiantesCasos(idCaso, selectedId);
      } else {
        await insertAsesoresCasos(idCaso, selectedId);
      }
      setOpen(false);
      onRefresh();
      toast.success(
        `${type === "estudiante" ? "Estudiante" : "Asesor"} reasignado exitosamente`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Error al reasignar");
    } finally {
      setLoading(false);
    }
  };

  const current =
    casosData && casosData.length > 0 ? casosData[casosData.length - 1] : null;
  const history =
    casosData && casosData.length > 1
      ? [...casosData].slice(0, casosData.length - 1).reverse()
      : [];

  const getNombre = (item: any) =>
    type === "estudiante"
      ? item.estudiante.perfil.nombre_completo
      : item.asesor.perfil.nombre_completo;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-600">
          {type === "estudiante" ? "Estudiante Actual" : "Asesor Actual"}
        </Label>
        <div className="flex items-center justify-between mt-1">
          {current ? (
            <div className="flex flex-col">
              <p
                className={
                  type === "estudiante"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-900 font-semibold"
                }
              >
                {getNombre(current)}
              </p>
              <p className="text-xs text-slate-500">
                CC:{" "}
                {type === "estudiante"
                  ? current.estudiante?.perfil?.cedula
                  : current.asesor?.perfil?.cedula}
                {type === "estudiante" &&
                  current.estudiante?.semestre &&
                  ` | Semestre: ${current.estudiante.semestre}`}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No asignado</p>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Reasignar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Reasignar {type === "estudiante" ? "Estudiante" : "Asesor"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <SearchableSelector
                  items={items}
                  value={selectedId}
                  onValueChange={setSelectedId}
                  placeholder={`Seleccione un ${type}`}
                  searchPlaceholder="Buscar por nombre o cédula..."
                  getItemValue={(item: any) => item.id_perfil.toString()}
                  getItemLabel={(item: any) => item.perfil.nombre_completo}
                  getItemSearchValue={(item: any) => item.perfil.cedula || ""}
                  renderItem={(item: any) => (
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {item.perfil.nombre_completo}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Turno: {item.turno}
                        {type === "estudiante" &&
                          item.semestre &&
                          ` | Semestre: ${item.semestre}`}
                      </span>
                    </div>
                  )}
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedId || loading}
                  onClick={handleReassign}
                >
                  {loading ? "Reasignando..." : "Confirmar Reasignación"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {history.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <Label className="text-gray-500 text-[10px] uppercase tracking-wider">
            Historial ({history.length})
          </Label>
          <ul className="mt-2 space-y-2">
            {history.map((h: any, idx: number) => (
              <li
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-500 line-through">
                  {getNombre(h)}
                </span>
                {h.fecha_asignacion && (
                  <span className="text-[10px] text-gray-400">
                    {new Date(h.fecha_asignacion).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
