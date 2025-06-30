/** @format */

import { DataAPIClient, Db } from "@datastax/astra-db-ts";

/**
 * Connects to a DataStax Astra database.
 * This function retrieves the database endpoint and application token from the
 * environment variables `API_ENDPOINT` and `APPLICATION_TOKEN`.
 *
 * @returns An instance of the connected database.
 * @throws Will throw an error if the environment variables
 * `API_ENDPOINT` or `APPLICATION_TOKEN` are not defined.
 */
export function connectToDatabase(): Db {
  try {
    const { ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN } = process.env;

    if (!ASTRA_DB_APPLICATION_TOKEN || !ASTRA_DB_API_ENDPOINT) {
      throw new Error(
        "Environment variables API_ENDPOINT and APPLICATION_TOKEN must be defined."
      );
    }

    // Create an instance of the `DataAPIClient` class
    const client = new DataAPIClient();

    // Get the database specified by your endpoint and provide the token
    const database = client.db(ASTRA_DB_API_ENDPOINT, {
      token: ASTRA_DB_APPLICATION_TOKEN,
    });

    console.log(`Connected to database ${database.id}`);

    return database;
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    throw new Error("Database connection failed");
  }
}
