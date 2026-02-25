import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ─── Route Permission Map ─────────────────────────────────────────────
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/asesor": ["asesor"],
  "/estudiante": ["estudiante"],
  "/pro-apoyo": ["pro_apoyo"],
};

// ─── Default home per role ─────────────────────────────────────────────
const ROLE_HOME: Record<string, string> = {
  admin: "/admin/inicio",
  asesor: "/asesor/inicio",
  estudiante: "/estudiante/inicio",
  pro_apoyo: "/pro-apoyo/inicio",
};

// ─── Decode JWT (solo para leer el claim de rol) ──────────────────────
function decodeJwtPayload(token: string): Record<string, any> {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // ─────────────────────────────────────────────────────────────────────
  // 1️⃣ Crear cliente Supabase
  // ─────────────────────────────────────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // ─────────────────────────────────────────────────────────────────────
  // 2️⃣ Permitir flujos de autenticación (PKCE, recovery, magic link)
  // ─────────────────────────────────────────────────────────────────────
  const isAuthFlow =
    searchParams.has("code") ||
    searchParams.has("token") ||
    searchParams.has("type");

  if (isAuthFlow) {
    return supabaseResponse;
  }

  // ─────────────────────────────────────────────────────────────────────
  // 3️⃣ Obtener sesión
  // ─────────────────────────────────────────────────────────────────────
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ─────────────────────────────────────────────────────────────────────
  // 4️⃣ Rutas públicas
  // ─────────────────────────────────────────────────────────────────────
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/recuperar-contrasena") ||
    pathname.startsWith("/cambiar-contrasena") ||
    pathname.startsWith("/auth");

  if (!session && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // ─────────────────────────────────────────────────────────────────────
  // 5️⃣ Si está autenticado, aplicar reglas de rol
  // ─────────────────────────────────────────────────────────────────────
  if (session) {
    // Permitir cambiar contraseña aunque tenga sesión temporal
    if (pathname.startsWith("/cambiar-contrasena")) {
      return supabaseResponse;
    }

    const payload = decodeJwtPayload(session.access_token);
    const userRole = payload.user_role ?? "";

    // Si está en login y ya tiene rol válido → redirigir a su home
    if (pathname === "/" && userRole) {
      const home = ROLE_HOME[userRole];
      if (home) {
        const url = request.nextUrl.clone();
        url.pathname = home;
        return NextResponse.redirect(url);
      }
    }

    // Proteger rutas por prefijo
    const matchedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
      pathname.startsWith(prefix)
    );

    if (matchedPrefix) {
      const allowedRoles = ROLE_ROUTES[matchedPrefix];

      if (!allowedRoles.includes(userRole)) {
        const home = ROLE_HOME[userRole] ?? "/";
        const url = request.nextUrl.clone();
        url.pathname = home;
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}