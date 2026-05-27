import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// 1. GET: Fetch all tasks for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userTasks = await db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// 2. POST: Create a new task
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, date, time, category } = body;

    if (!title || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const [createdTask] = await db
      .insert(tasks)
      .values({
        id: id || `task_${Date.now()}`,
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        date: date || null,
        time: time?.trim() || null,
        category,
      })
      .returning();

    return NextResponse.json(createdTask);
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// 3. PUT: Update an existing task
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, date, time, category } = body;

    if (!id) {
      return new NextResponse("Missing task ID", { status: 400 });
    }

    // Verify task ownership and update
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...(title !== undefined ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(date !== undefined ? { date: date || null } : {}),
        ...(time !== undefined ? { time: time?.trim() || null } : {}),
        ...(category !== undefined ? { category } : {}),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!updatedTask) {
      return new NextResponse("Task not found or unauthorized", { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PUT /api/tasks error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// 4. DELETE: Remove a task
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing task ID", { status: 400 });
    }

    const [deletedTask] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!deletedTask) {
      return new NextResponse("Task not found or unauthorized", { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: deletedTask.id });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
