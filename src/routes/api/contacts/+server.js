import { json } from "@sveltejs/kit";
import { connectDB } from "./../../../lib/db";

export async function GET() {
  const db = await connectDB();
  const contacts = await db.collection("contacts").find().toArray();
  return json(contacts);
}

export async function POST({ request }) {
  const db = await connectDB();
  const data = await request.json();
  const newContact = {
    name: data.name,
    phone: data.phone
  };
  await db.collection("contacts").insertOne(newContact);
  return json({ message: "Contact created!" });
}
