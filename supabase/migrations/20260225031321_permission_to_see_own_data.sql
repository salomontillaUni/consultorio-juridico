create policy "Enable users to view their own data only"
on "public"."estudiantes"
as PERMISSIVE
for SELECT
to authenticated
using (
    (select auth.uid()) = id_perfil
);

create policy "Enable users to update their own data only"
on "public"."asesores"
as PERMISSIVE
for UPDATE
to authenticated
using (
    (select auth.uid()) = id_perfil
);
