
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}
const client = new MongoClient(mongoUri);
let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
  }
  return db;
}
