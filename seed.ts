/**
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient, type perfilesScalars } from "@snaplet/seed";
import { copycat } from '@snaplet/copycat';
import { supabase } from "./src/utils/supabase";

const main = async () => {
  const seed = await createSeedClient({
    dryRun: true
  });
  // Truncate all tables in the database
  await seed.$resetDatabase();
  //registra usuarios de prueba
  const PASSWORD = "testuser";
  for (let i = 0; i < 5; i += 1) {
    const email = copycat.email(i);
    const nombre_completo: string = copycat.fullName(i);
    const cedula: string = copycat.int(i, {min: 1000000, max: 9999999}).toString();
    const telefono: string = copycat.phoneNumber(i,  {prefixes: ['+57'], length: {min: 10, max: 10}}).toString();
    await supabase.auth.signUp({
        email,
        password: PASSWORD,
        options: {
        data: {
          nombre_completo,
          cedula,
          telefono
        }
      }
    });
  }
 

  const {data: databaseProfiles} = await supabase.from('perfiles').select();
  const perfiles: perfilesScalars[] = databaseProfiles?.map(perfil => ({
    id: perfil.id,
    nombre_completo: perfil.nombre_completo,
    correo: perfil.correo,
    cedula: perfil.cedula,
    telefono: perfil.telefono
  }))??[];

  console.log("Database seeded successfully!");
  console.log("perfiles creado :", perfiles);
  process.exit();
};
main();



