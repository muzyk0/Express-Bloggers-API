import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_URI } from "../constants";

const credentials: string | undefined = undefined;

export const client = new MongoClient(MONGO_URI, {
    sslKey: credentials,
    sslCert: credentials,
    serverApi: ServerApiVersion.v1,
});

export const db = client.db("bloggers");

export async function runDB() {
    try {
        // Contect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("bloggers").command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    } catch {
        // Ensures that the client will close when you finish/error
        console.error("Failed to connect to DB");
        await client.close();
    }
}
