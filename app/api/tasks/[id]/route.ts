import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/Task";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/lib/auth";
import Task from "@/app/models/Task";
import { connect } from "http2";
import { randomUUID } from "crypto";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params; // ✅ WAJIB await

    console.log("TASK ID:", id);

    const task = await Task.findOne({id});

    if (!task) {
      return Response.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: task,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}