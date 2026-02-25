"use client";
import { useState, useEffect } from "react";
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
import { AlertCircleIcon, MailIcon } from "lucide-react";
import { supabase } from "@/utils/supabase/supabase";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    setIsLoading(true);
    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/cambiar-contrasena`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setCooldown(120); // 2 minutos de espera
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-blue-100 to-blue-200">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center">Recuperar contraseña</CardTitle>
          <CardDescription className="text-center">
            Te enviaremos un enlace para establecer tu contraseña.
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

            <Button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              {cooldown > 0
                ? `Reintentar en ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, "0")}`
                : "Enviar enlace"}
            </Button>

            {success ? (
              <Alert>
                <AlertTitle>Revisa tu correo</AlertTitle>
                <AlertDescription>
                  Si el correo existe, recibirás un enlace para establecer tu
                  contraseña.
                </AlertDescription>
              </Alert>
            ) : null}

            {error ? (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
