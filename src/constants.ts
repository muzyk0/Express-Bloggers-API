export const MONGO_URI: string =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/?maxPoolSize=20&w=majority";
