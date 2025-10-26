alter table public.usuarios
alter column id_usuario set default gen_random_uuid();
