"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../lib/supabase/supabase-client";

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("🔍 Sesión actual:", data.session);
      console.log("⚠️ Error de sesión:", error);

      // Escuchar cambios de estado
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("🔔 Evento de Auth:", event);
        console.log("👤 Sesión en evento:", session);
      });
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        if (!error) {
          router.push("/");
          router.refresh();
          supabase.auth.signOut();
        }
      }, 1000);
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-indigo-100 to-sky-200">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md animate-in fade-in zoom-in duration-500">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 bg-green-100 w-20 h-20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              ¡Contraseña actualizada!
            </CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              Tu seguridad es nuestra prioridad. Redirigiendo al inicio de
              sesión...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <div className="h-1.5 w-full max-w-[200px] bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-progress origin-left"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-indigo-100 to-sky-200">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="h-2 bg-blue-500 w-full" />
        <CardHeader className="space-y-2 pt-8">
          <CardTitle className="text-3xl font-extrabold text-center text-slate-800 tracking-tight">
            Nueva Contraseña
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Asegura tu cuenta con una contraseña fuerte y única.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                title="La contraseña debe tener al menos 6 caracteres"
                className="text-slate-700 font-medium"
              >
                Nueva contraseña
              </Label>
              <div className="relative group transition-all">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 h-4 w-4 transition-colors" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                title="Repite la nueva contraseña"
                className="text-slate-700 font-medium"
              >
                Confirmar contraseña
              </Label>
              <div className="relative group transition-all">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 h-4 w-4 transition-colors" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all rounded-lg"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Actualizando...
                </>
              ) : (
                "Cambiar contraseña"
              )}
            </Button>

            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300 border-red-200 bg-red-50"
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle className="font-bold">Atención</AlertTitle>
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <p className="text-xs text-slate-400 text-center">
            ¿Necesitas ayuda? Contacta al soporte técnico de la Universidad.
          </p>
        </div>
      </Card>
    </div>
  );
}
