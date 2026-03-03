ALTER TABLE public.perfiles_roles 
ADD CONSTRAINT perfiles_roles_user_id_fkey_perfiles 
FOREIGN KEY (user_id) REFERENCES public.perfiles(id) ON DELETE CASCADE;

ALTER TYPE app_permission 
ADD VALUE 'perfiles_roles.read';

