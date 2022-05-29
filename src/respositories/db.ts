import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_URI } from "../constants";
import * as mongoose from "mongoose";

const credentials: string | undefined = undefined;

export const mongoDBClient = new MongoClient(MONGO_URI, {
    sslKey: credentials,
    sslCert: credentials,
    serverApi: ServerApiVersion.v1,
});

/**
 * @deprecated
 */
export const db = mongoDBClient.db("bloggers");

export async function runDB() {
    try {
        // Contect the client to the server
        // await mongoose.connect(MONGO_URI, {sslKey: credentials,});
        // Establish and verify connection
        await mongoDBClient.connect();
        await mongoDBClient.db("bloggers").command({ ping: 1 });
        console.log("Connected successfully to mongo server");
    } catch {
        // Ensures that the client will close when you finish/error
        console.error("Failed to connect to DB");
        await mongoDBClient.close();
    }
}
