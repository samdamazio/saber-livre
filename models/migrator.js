import { resolve } from "node:path";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";

const defaultMigrationOptions = {
  // databaseUrl: process.env.DATABASE_URL, outra forma de passar a conexão
  dir: resolve("infra", "migrations"),
  direction: "up",
  dryRun: true,
  migrationsTable: "pgmigrations",
  log: () => {},
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
