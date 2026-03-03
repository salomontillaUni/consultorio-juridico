INSERT INTO public.role_permissions (role, permission)
VALUES
('admin', 'perfiles_roles.read');

create policy "allow admin to see data"
on "public"."perfiles_roles"
as PERMISSIVE
for SELECT
to public
using (authorize('perfiles_roles.read'::app_permission));