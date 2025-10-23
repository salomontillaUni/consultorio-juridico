'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando sesión")
    loginUser(email, password);
  };

  const loginUser = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
    } else {
      console.log("Inicio de sesión exitoso");
      
    }
  };

  useEffect(() => {
    function saveSession(
      /** @type {Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']} */
      session
    ) {
      setSession(session)
      const currentUser = session?.user
      if (session) {
        const jwt = jwtDecode(session.access_token)
        console.log("JWT Decoded:", jwt)
      }
      setUser(currentUser ?? null)
      setUserLoaded(!!currentUser)
      if (currentUser) {
        console.log("Usuario actual:", currentUser)
      }
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

  const getRolUsuario = async (email: string) => {

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

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Iniciar sesión
          </Button>
        </form>

      </CardContent>
    </Card>
  );
}