ALTER TYPE public.app_permission 
ADD VALUE IF NOT EXISTS 'mis_casos.read';

ALTER TYPE public.app_permission 
ADD VALUE IF NOT EXISTS 'mis_casos.update';

alter table public.role_permissions enable row level security;



-- Nuevos permisos
insert into public.role_permissions (role, permission) values
('estudiante', 'casos_asignados.read'),
('estudiante', 'casos_asignados.update');

insert into public.role_permissions (role, permission) values
('asesor', 'casos_asignados.read'),
('asesor', 'casos_asignados.update');

delete from public.role_permissions
where id = 115;

delete from public.role_permissions
where id = 122;

DROP POLICY IF EXISTS "permitir ver casos asignados propios" ON public.casos;
DROP POLICY IF EXISTS "permitir actualizar casos asignados propios" ON public.casos;

create policy "permitir ver solo casos asignados" 
on public.casos
for select using (
  public.authorize('casos_asignados.read') 
  AND public.estaAsignado(auth.uid(), id_caso)
);

create policy "permitir actualizar solo casos asignados" 
on public.casos
for update using (
  public.authorize('casos_asignados.update') 
  AND public.estaAsignado(auth.uid(), id_caso)
);
