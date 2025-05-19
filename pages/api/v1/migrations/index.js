import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import db from "node-pg-migrate/dist/db";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    // databaseUrl: process.env.DATABASE_URL, outra forma de passar a conexão
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    dryRun: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  } else if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
