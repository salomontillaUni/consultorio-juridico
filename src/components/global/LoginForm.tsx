'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { supabase } from "../../utils/supabase";
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      const session = data.session;
      if (session) {
        const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
        const role = jwt.user_role;
        switch (role) {
          case "admin":
            router.push("/admin/inicio");
            break;
          case "estudiante":
            router.push("/estudiante/inicio");
            break;
          case "asesor":
            router.push("/asesor/inicio");
            break;
          case "pro_apoyo":
            router.push("/pro-apoyo/inicio");
            break;
          default:
            setError("Rol de usuario no reconocido.");
        }
      }
    } catch (error) {
      setError("Error al iniciar sesión. " + error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleOlvidasteContraseña(): void {
    console.log("Redirigiendo a la página de recuperación de contraseña...");
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center">Bienvenido!</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-primary hover:underline hover:cursor-pointer"
              onClick={() => handleOlvidasteContraseña()}
            >
              Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600">
            {isLoading ? <Spinner className="mr-2" /> : null}
            Iniciar sesión
          </Button>
          {error && (
            <Alert variant="destructive" className="">
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        </form>

      </CardContent>
    </Card>
  );

}