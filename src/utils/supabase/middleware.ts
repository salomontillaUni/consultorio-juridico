import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ─── Route Permission Map ──────────────────────────────────────────────────────
// Maps a URL path prefix to the roles allowed to access it.
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin":      ["admin"],
  "/asesor":     ["asesor"],
  "/estudiante": ["estudiante"],
  "/pro-apoyo":  ["pro_apoyo"],
};

// Default home dashboard per role — used for redirection on unauthorized access.
const ROLE_HOME: Record<string, string> = {
  admin:      "/admin/inicio",
  asesor:     "/asesor/inicio",
  estudiante: "/estudiante/inicio",
  pro_apoyo:  "/pro-apoyo/inicio",
};

/** Decode a JWT without verifying signature 
 *  (safe here — we only use it to read the role for redirection,
 *   the actual security is enforced by Supabase RLS on the server).
 */
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1];
    // Edge Runtime supports atob
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT add any logic between createServerClient and getSession().
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // ── 1. Unauthenticated users ─────────────────────────────────────────────────
  if (!session && pathname !== "/" && !pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // ── 2. Authenticated users: enforce role-based access ───────────────────────
  if (session) {
    // Decode the JWT to get the custom `user_role` claim injected by the Supabase hook
    const payload = decodeJwtPayload(session.access_token);
    const userRole = (payload.user_role as string) ?? "";

    // If the user navigates to the login page while already logged in,
    // redirect them to their own home dashboard.
    if (pathname === "/") {
      const home = ROLE_HOME[userRole] ?? "/";
      if (home !== "/") {
        const url = request.nextUrl.clone();
        url.pathname = home;
        return NextResponse.redirect(url);
      }
    }

    // Find which protected route group this pathname belongs to.
    const matchedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
      pathname.startsWith(prefix)
    );

    if (matchedPrefix) {
      const allowedRoles = ROLE_ROUTES[matchedPrefix];

      if (!allowedRoles.includes(userRole)) {
        // The user's role is NOT allowed here — redirect to their own dashboard.
        const home = ROLE_HOME[userRole] ?? "/";
        const url = request.nextUrl.clone();
        url.pathname = home;
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
