-- Otorga permisos de uso al esquema
grant usage on schema public to supabase_auth_admin;

-- Permite al auth admin ejecutar el hook de tokens
grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

-- Revoca ejecución del hook a roles públicos
revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon;

grant all
  on table public.perfiles_roles
  to supabase_auth_admin;

-- Revoca todos los permisos de esa tabla a roles comunes
revoke all
  on table public.perfiles_roles
  from authenticated, anon;
