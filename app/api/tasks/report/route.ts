
import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/Task";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/lib/auth";
import Task from "@/app/models/Task";
import { connect } from "http2";
import { randomUUID } from "crypto";
import User from "@/app/models/User";
import DaycareParticipant from "@/app/models/DaycareParticipant";
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const status = searchParams.get("status");

    // ✅ default hari ini
    const startDate = date
      ? new Date(date)
      : new Date(new Date().setHours(0, 0, 0, 0));

    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const filter: any = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (status) {
      filter.status = status;
    }

    // 🔥 ambil task
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    // 🔥 ambil semua user + daycare sekali (biar efisien)
    const users = await User.find();
    const participants = await DaycareParticipant.find();

    // 🔥 convert ke map biar cepat lookup
    const userMap = new Map(users.map(u => [u._id.toString(), u]));
    const participantMap = new Map(
      participants.map(p => [p._id.toString(), p])
    );

    // 🔥 mapping result
    const result = tasks.map((task: any) => {
      const user = userMap.get(task.userId);

      const daycareNames = (task.daycareParticipantIds || [])
        .map((id: string) => participantMap.get(id)?.name)
        .filter(Boolean)
        .join(", ");

      return {
        id: task._id,
        userEmail: user?.email || task.userId || "-", // fallback
        daycareParticipants: daycareNames || "-",
        status: task.status,
        date: task.createdAt,
      };
    });

    return Response.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}