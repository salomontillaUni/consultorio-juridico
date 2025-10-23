alter table public.perfiles_roles enable row level security;
-- Permitir que el usuario autenticado lea su propio rol
create policy "permitir leer su propio rol"
on public.perfiles_roles
for select
using (auth.uid() = user_id);

GRANT SELECT ON public.perfiles_roles TO authenticated;
GRANT SELECT ON public.perfiles TO authenticated;
GRANT SELECT ON public.role_permissions TO authenticated;
