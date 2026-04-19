import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/Task";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/lib/auth";
import Task from "@/app/models/Task";
import { connect } from "http2";
import { randomUUID } from "crypto";
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let task;

    if (body.id) {
      // 🔥 UPDATE + fallback CREATE kalau tidak ditemukan
      task = await Task.findOneAndUpdate(
        { id: body.id },
        {
          ...body,
          modifiedAt: new Date(),
        },
        {
          new: true,
          upsert: true, // ✅ kalau tidak ada → create
          returnDocument: "after", // ✅ FIX warning mongoose
        }
      );

    } else {
     body.id = randomUUID()
      // 🔥 CREATE BARU
      task = await Task.create({
        ...body
      });
    }

    return Response.json({
      success: true,
      data: task,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}
