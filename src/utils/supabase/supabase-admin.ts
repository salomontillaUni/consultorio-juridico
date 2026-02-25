import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client — uses the service role key.
 * NEVER expose this client on the browser. Only use in Server Actions or API routes.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
const serviceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
