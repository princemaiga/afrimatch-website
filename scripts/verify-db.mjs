import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require" });

try {
  // List all tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  
  console.log("✅ Connected to Neon database successfully!");
  console.log(`\n📋 Tables created (${tables.length} total):`);
  tables.forEach(t => console.log(`  ✓ ${t.table_name}`));
  
  // Count rows in users table
  const userCount = await sql`SELECT COUNT(*) as count FROM users`;
  console.log(`\n👥 Users in database: ${userCount[0].count}`);
  
} catch (error) {
  console.error("❌ Database error:", error.message);
} finally {
  await sql.end();
}
