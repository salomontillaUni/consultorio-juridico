"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { supabase } from "../../utils/supabase/supabase";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "app/types/jwt";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await supabase.auth.refreshSession();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Correo o contraseña incorrectos.");
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }
      const session = data.session;

      if (session) {
        const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
        const role = jwt.user_role;
        console.log(jwt);
        switch (role) {
          case "admin":
            router.refresh();
            router.push("/admin/inicio");
            break;
          case "estudiante":
            router.refresh();
            router.push("/estudiante/inicio");
            break;
          case "asesor":
            router.refresh();
            router.push("/asesor/inicio");
            break;
          case "pro_apoyo":
            router.refresh();
            router.push("/pro-apoyo/inicio");
            break;
          default:
            setError("Rol de usuario no reconocido.");
        }
      }
    } catch (error) {
      setError("Error al iniciar sesión. " + error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToPasswordReset = () => {
    router.refresh();
    router.push("/recuperar-contrasena");
  };

  return (
    <Card className="w-full mx-auto border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="space-y-2 pb-6 pt-8 px-8 border-b border-slate-100 bg-white">
        <CardTitle className="text-2xl font-bold text-center text-slate-900 tracking-tight">
          ¡Bienvenido de nuevo!
        </CardTitle>
        <CardDescription className="text-center text-slate-500 font-medium text-sm">
          Ingresa tus credenciales para acceder a tu panel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-8 px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-slate-700 font-semibold text-sm"
            >
              Correo Electrónico
            </Label>
            <div className="relative group">
              <MailIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@uniautonoma.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 text-sm rounded-xl focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="text-slate-700 font-semibold text-sm"
            >
              Contraseña
            </Label>
            <div className="relative group">
              <LockIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 text-sm rounded-xl focus-visible:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-hidden"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all text-left w-max"
              onClick={handleRedirectToPasswordReset}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
              Si eres un usuario nuevo o es la primera vez que ingresas, debes
              restablecer tu contraseña haciendo clic en el enlace superior.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-semibold text-base mt-2"
          >
            {isLoading ? <Spinner className="mr-2 h-5 w-5" /> : null}
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>

          {error && (
            <Alert
              variant="destructive"
              className="mt-4 border-red-200 bg-red-50 text-red-800 rounded-xl"
            >
              <AlertCircleIcon className="h-5 w-5 text-red-600" />
              <AlertTitle className="font-semibold text-red-900">
                Error de Acceso
              </AlertTitle>
              <AlertDescription className="text-red-700 text-sm mt-1">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
