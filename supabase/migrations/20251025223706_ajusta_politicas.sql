REVOKE SELECT ON public.perfiles_roles FROM authenticated;
REVOKE SELECT ON public.perfiles FROM authenticated;
REVOKE SELECT ON public.role_permissions FROM authenticated;

create policy "permitir ver perfil propio" on public.perfiles for select using  (
  (select auth.uid()) = id
);
