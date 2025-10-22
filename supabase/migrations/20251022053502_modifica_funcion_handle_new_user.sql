create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre_completo, correo, cedula, telefono)
  values (new.id, 
  new.raw_user_meta_data ->> 'nombre_completo', 
  new.email, 
  new.raw_user_meta_data ->> 'cedula', 
  new.raw_user_meta_data ->> 'telefono');
  return new;
end;
$$;