create policy "Enable users to view their own data only"
on "public"."asesores"
as PERMISSIVE
for SELECT
to authenticated
using (
    (select auth.uid()) = id_perfil
);