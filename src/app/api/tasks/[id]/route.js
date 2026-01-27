import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("todoNext");

    await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: body.title,
          description: body.description,
          status: body.status,
        },
      }
    );
    return Response.json({ message: "Task updated" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db("todoNext");

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
    });

    if (!result.deletedCount) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
