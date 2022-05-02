export const PORT = process.env.PORT ?? 5000;

/**
 * This is base URL for API.
 * @use "/api"
 */
export const BASE_URL = process.env.BASE_URL ?? "";

export const MONGO_URI: string =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/?maxPoolSize=20&w=majority";
