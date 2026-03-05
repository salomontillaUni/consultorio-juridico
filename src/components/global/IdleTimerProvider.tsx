"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MAX_IDLE_TIME = 15 * 60 * 1000; // 15 minutos (milisegundos)
const WARNING_TIME = 14 * 60 * 1000; // 14 minutos (milisegundos)

export default function IdleTimerProvider() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const lastActivityTime = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen to Auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === "SIGNED_OUT") {
        // Limpiar caché, local storage, o estados globales (cumpliendo con la restricción solicitada)
        localStorage.clear();
        sessionStorage.clear();

        // Redirigir al inicio de sesión
        router.push("/login");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    const resetTimer = () => {
      if (showWarning) return; // Si el modal de advertencia está abierto, no podemos reiniciar solo moviendo el mouse.
      lastActivityTime.current = Date.now();
    };

    // Eventos a monitorizar para detectar inactividad
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "DOMMouseScroll",
      "mousewheel",
      "touchmove",
      "touchstart",
    ];

    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Monitoreando el tiempo periódicamente
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeIdle = currentTime - lastActivityTime.current;

      if (timeIdle >= MAX_IDLE_TIME) {
        // Forzar desconexión
        handleLogout();
      } else if (timeIdle >= WARNING_TIME && !showWarning) {
        // Mostrar advertencia en el minuto 14
        setShowWarning(true);
        setTimeLeft(Math.floor((MAX_IDLE_TIME - timeIdle) / 1000));
      }
    }, 5000); // Check every 5 seconds for accuracy

    // Limpieza de event listeners al desmontar, evitando posibles fugas de memoria
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, showWarning]);

  // Manejador del temporizador de advertencia (- 1 segundo)
  useEffect(() => {
    if (showWarning) {
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showWarning]);

  const handleLogout = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowWarning(false);

    // Finalizamos la sesión lo cual triggerea el evento SIGNED_OUT, limpiando el estado.
    await supabase.auth.signOut();
  };

  const handleContinue = () => {
    // Si el usuario decide continuar, refrescamos el timer.
    setShowWarning(false);
    lastActivityTime.current = Date.now();
  };

  if (!isAuthenticated) return null;

  return (
    <Dialog
      open={showWarning}
      onOpenChange={(open) => {
        if (!open) handleContinue();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aviso de Inactividad</DialogTitle>
          <DialogDescription>
            Por su seguridad, su sesión expirará en {timeLeft} segundos si no
            realiza ninguna acción. ¿Desea mantener la sesión activa?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continuar Sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
