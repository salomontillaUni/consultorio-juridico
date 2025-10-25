'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { User } from "@supabase/supabase-js";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null>(null)
  const router = useRouter();
  const [role, setRole] = useState<Promise<string | null>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email, password);
  };

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try{
      const {data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Error al iniciar sesión: " + error.message);
      } 
      setIsLoading(false);
    }catch(error){
      console.error("Error inesperado al iniciar sesión:", error);
    }

  };

  useEffect(() => {
    function saveSession(
      session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
    ) {
      setSession(session)
      const currentUser = session?.user
      if (session) {
        const jwt = jwtDecode(session.access_token)
        currentUser.appRole = jwt.user_role;
        switch (currentUser.appRole) {
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
            setError("Rol de usuario no reconocido. Contacta al soporte.");
            supabase.auth.signOut();
            break;
        }
      }
      setUserLoaded(!!currentUser)
    }

    supabase.auth.getSession().then(({ data: { session } }) => saveSession(session))

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (data, session) => {
        console.log(session)
        saveSession(session)
      }
    )

    return () => {
      authListener.subscription.unsubscribe();
    }
  }, [])

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isLoading ? <Spinner className="mr-2"/> : null}
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