ALTER TYPE public.app_permission 
ADD VALUE IF NOT EXISTS 'casos_asignados.read';

ALTER TYPE public.app_permission 
ADD VALUE IF NOT EXISTS 'casos_asignados.update';

alter table public.role_permissions enable row level security;


