-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Fetch the user role in the perfiles_roles table
    select role into user_role from public.perfiles_roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

grant all
  on table public.perfiles_roles
to supabase_auth_admin;

revoke all
  on table public.perfiles_roles
  from authenticated, anon, public;

create policy "Allow auth admin to read user roles" ON public.perfiles_roles
as permissive for select
to supabase_auth_admin
using (true);

-- LEE EL ROL DEL USUARIO DEL JWT Y VERIFICA SUS PERMISOS
create or replace function public.authorize(
  requested_permission app_permission
)
returns boolean as $$
declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Fetch user role once and store it to reduce number of calls
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  select count(*)
  into bind_permissions
  from public.role_permissions
  where role_permissions.permission = requested_permission
    and role_permissions.role = user_role;

  return bind_permissions > 0;
end;
$$ language plpgsql stable security definer set search_path = '';

-- POLITICAS DE SEGURIDAD --
-- POLITICAS DE PERFILES
create policy "permitir insertar un perfil" on public.perfiles for insert with check (
    authorize('perfiles.insert')
);
create policy "permitir ver todos los perfiles" on public.perfiles for select using (
    public.authorize('perfiles.read')
);
create policy "permitir actualizar un perfil" on public.perfiles for update using (
    public.authorize('perfiles.update')
);
create policy "permitir actualizar perfil propio" on public.perfiles for update using  (
  (select auth.uid()) = id
);
-- POLITICAS DE CASOS
create policy "permitir insertar un caso" on public.casos for insert with check (
    public.authorize('casos.create')
);
create policy "permitir ver todos los casos" on public.casos for select using (
    public.authorize('casos.read')
);
create policy "permitir actualizar un caso" on public.casos for update using (
    public.authorize('casos.update')
);
create policy "permitir eliminar un caso" on public.casos for delete using (
    public.authorize('casos.delete')
);
-- FUNCION PARA VERIFICAR SI EL ESTUDIANTE O ASESOR ESTA ASIGNADO AL CASO
CREATE FUNCTION public.estaAsignado(uid uuid, caso_id integer)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.estudiantes_casos WHERE id_estudiante = uid AND id_caso = caso_id
    UNION ALL
    SELECT 1 FROM public.asesores_casos WHERE id_asesor = uid AND id_caso = caso_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

create policy "permitir ver casos asignados propios" on public.casos for select using (
    public.authorize('casos.read') AND public.estaAsignado(auth.uid(), id_caso)
);

create policy "permitir actualizar casos asignados propios" on public.casos for update using (
    public.authorize('casos.update') AND public.estaAsignado(auth.uid(), id_caso)
);
-- POLITICAS DE USUARIOS
create policy "permitir insertar un usuario" on public.usuarios for insert with check (
    public.authorize('usuarios.create')
);
create policy "permitir ver todos los usuarios" on public.usuarios for select using (
    public.authorize('usuarios.read')
);
create policy "permitir actualizar un usuario" on public.usuarios for update using (
    public.authorize('usuarios.update')
);
create policy "permitir eliminar un usuario" on public.usuarios for delete using (
    public.authorize('usuarios.delete')
);
-- POLITICAS DE CONTRATOS LABORALES
create policy "permitir insertar un contrato laboral" on public.contratos_laborales for insert with check (
    public.authorize('contratos_laborales.create')
);
create policy "permitir ver todos los contratos laborales" on public.contratos_laborales for select using (
    public.authorize('contratos_laborales.read')
);
create policy "permitir actualizar un contrato laboral" on public.contratos_laborales for update using (
    public.authorize('contratos_laborales.update')
);
create policy "permitir eliminar un contrato laboral" on public.contratos_laborales for delete using (
    public.authorize('contratos_laborales.delete')
);
-- POLITICAS DE ESTUDIANTES
create policy "permitir insertar un estudiante" on public.estudiantes for insert with check (
    public.authorize('estudiantes.create')
);
create policy "permitir ver todos los estudiantes" on public.estudiantes for select using (
    public.authorize('estudiantes.read')
);
create policy "permitir actualizar un estudiante" on public.estudiantes for update using (
    public.authorize('estudiantes.update')
);
create policy "permitir eliminar un estudiante" on public.estudiantes for delete using (
    public.authorize('estudiantes.delete')
);
-- POLITICAS DE ASESORES
create policy "permitir insertar un asesor" on public.asesores for insert with check (
    public.authorize('asesores.create')
);
create policy "permitir ver todos los asesores" on public.asesores for select using (
    public.authorize('asesores.read')
);
create policy "permitir actualizar un asesor" on public.asesores for update using (
    public.authorize('asesores.update')
);
create policy "permitir eliminar un asesor" on public.asesores for delete using (
    public.authorize('asesores.delete')
);
-- POLITICAS DE DEMANDADOS
create policy "permitir insertar un demandado" on public.demandados for insert with check (
    public.authorize('demandados.create')
);
create policy "permitir ver todos los demandados" on public.demandados for select using (
    public.authorize('demandados.read')
);
create policy "permitir actualizar un demandado" on public.demandados for update using (
    public.authorize('demandados.update')
);
create policy "permitir eliminar un demandado" on public.demandados for delete using (
    public.authorize('demandados.delete')
);
-- POLITICAS DE ESTUDIANTES_CASOS
create policy "permitir insertar un estudiante_caso" on public.estudiantes_casos for insert with check (
    public.authorize('estudiantes_casos.create')
);
create policy "permitir ver todos los estudiantes_casos" on public.estudiantes_casos for select using (
    public.authorize('estudiantes_casos.read')
);
create policy "permitir ver estudiantes_casos propios" on public.estudiantes_casos for select using (
    public.authorize('estudiantes_casos.read') AND id_estudiante = (select auth.uid())
);
create policy "permitir actualizar un estudiante_caso" on public.estudiantes_casos for update using (
    public.authorize('estudiantes_casos.update')
);
create policy "permitir eliminar un estudiante_caso" on public.estudiantes_casos for delete using (
    public.authorize('estudiantes_casos.delete')
);
-- POLITICAS DE ASESORES_CASOS
create policy "permitir insertar un asesor_caso" on public.asesores_casos for insert with check (
    public.authorize('asesores_casos.create')
);
create policy "permitir ver todos los asesores_casos" on public.asesores_casos for select using (
    public.authorize('asesores_casos.read')
);
create policy "permitir ver asesores_casos propios" on public.asesores_casos for select using (
    public.authorize('asesores_casos.read') AND id_asesor = (select auth.uid())
);
create policy "permitir actualizar un asesor_caso" on public.asesores_casos for update using (
    public.authorize('asesores_casos.update')
);
create policy "permitir eliminar un asesor_caso" on public.asesores_casos for delete using (
    public.authorize('asesores_casos.delete')
);
