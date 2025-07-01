/** @format */

import { DataAPIClient, Db } from "@datastax/astra-db-ts";

let dbInstance: Db | null = null;

/**
 * Connects to a DataStax Astra database.
 * This function retrieves the database endpoint and application token from the
 * environment variables `API_ENDPOINT` and `APPLICATION_TOKEN`.
 *
 * @returns A singleton instance of the connected database.
 * @throws Will throw an error if the environment variables
 * `API_ENDPOINT` or `APPLICATION_TOKEN` are not defined.
 */
export function connectToDatabase(): Db {
  if (dbInstance) {
    return dbInstance;
  }

  const { ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN } = process.env;

  if (!ASTRA_DB_APPLICATION_TOKEN || !ASTRA_DB_API_ENDPOINT) {
    throw new Error(
      "Environment variables ASTRA_DB_API_ENDPOINT and ASTRA_DB_APPLICATION_TOKEN must be defined."
    );
  }

  const client = new DataAPIClient();

  dbInstance = client.db(ASTRA_DB_API_ENDPOINT, {
    token: ASTRA_DB_APPLICATION_TOKEN,
  });

  console.log(`Connected to database ${dbInstance.id}`);

  return dbInstance;
}
