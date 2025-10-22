/**
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { copycat } from '@snaplet/copycat';
import { supabase } from "./src/utils/supabase";

const main = async () => {
  const seed = await createSeedClient({
    dryRun: true
  });
  // Truncate all tables in the database
  await seed.$resetDatabase();

  const PASSWORD = "testuser";
  for (let i = 0; i < 5; i += 1) {
    const email = copycat.email(i);
    const nombre_completo: string = copycat.fullName(i);
    const cedula: string = copycat.phoneNumber.toString();
    const telefono: string = copycat.phoneNumber.toString();
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

  console.log("Database seeded successfully!");
  process.exit();
};
main();



