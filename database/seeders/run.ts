import { useSqlite, Migrator } from 'aerojs';
import CreateSaaSSchema from '../migrations/2026_10_02_000001_create_saas_schema.js';
import { DatabaseSeeder } from './DatabaseSeeder.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Ensure storage folder exists
const storageDir = path.resolve('storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Connect Native SQLite
const dbPath = path.resolve('storage/database.sqlite');
console.log(`[AeroSaaS] Initializing SQLite database at: ${dbPath}`);
useSqlite(dbPath);

async function main() {
  const migrator = new Migrator('default');

  console.log('[AeroSaaS] Running migrations...');
  const migrationInstance = new CreateSaaSSchema();
  const ran = await migrator.runMigrations([
    { name: migrationInstance.name, migration: migrationInstance }
  ]);
  console.log(`[AeroSaaS] Executed migrations:`, ran.length > 0 ? ran : 'Already up to date');

  await DatabaseSeeder.run();
  console.log('[AeroSaaS] Initialization complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[AeroSaaS] Seeder failed:', err);
  process.exit(1);
});
