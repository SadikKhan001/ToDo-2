import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("todoNext");

    const result = await db.collection("tasks").find({}).toArray();

    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch tasks" },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("todoNext");

    const data = await req.json();

    const result = await db.collection("tasks").insertOne(data);

    return Response.json(
      {
        message: "Task added",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: "Failed to add task" }, { status: 500 });
  }
}
