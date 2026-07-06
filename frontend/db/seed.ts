import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log("🌱 Iniciando seed...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  await db.insert(users).values([
    {
      email: "admin@est.univalle.edu",
      name: "Admin SICI",
      passwordHash: adminPassword,
      role: "admin",
      bio: "Administrador del sistema SICI",
      isiPoints: 0,
    },
    {
      email: "student@est.univalle.edu",
      name: "Estudiante Demo",
      passwordHash: studentPassword,
      role: "student",
      bio: "Estudiante de ejemplo",
      semester: 5,
      isiPoints: 0,
    },
  ]);

  console.log("✅ Seed completado:");
  console.log("   - Admin: admin@sici.edu.pe / admin123");
  console.log("   - Student: student@sici.edu.pe / student123");

  await pool.end();
}

seed().catch((error) => {
  console.error("❌ Error en seed:", error);
  process.exit(1);
});
