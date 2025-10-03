import { json } from "@sveltejs/kit";
import { connectDB } from "$lib/db";

export async function PUT({ params, request }) {
  const db = await connectDB();
  const { name, phone } = await request.json();
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (phone !== undefined) updateFields.phone = phone;
  if (Object.keys(updateFields).length === 0) {
    return json({ message: "No fields to update." }, { status: 400 });
  }
  const result = await db
    .collection("contacts")
    .updateOne({ _id: db.client.constructor.ObjectId(params.id) }, { $set: updateFields });
  if (result.matchedCount === 0) {
    return json({ message: "Contact not found or not updated." }, { status: 404 });
  }
  return json({ message: "Contact updated!" });
}

export async function DELETE({ params }) {
  const db = await connectDB();
  await db.collection("contacts").deleteOne({ _id: db.client.constructor.ObjectId(params.id) });
  return json({ message: "Contact deleted!" });
}
