import * as XLSX from "xlsx";
import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/Task";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/lib/auth";
import Task from "@/app/models/Task";
import { connect } from "http2";
import { randomUUID } from "crypto";
import DaycareParticipant from "@/app/models/DaycareParticipant";
import User from "@/app/models/User";

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

    // 🔥 ambil data
    const tasks = await Task.find(filter);

    const users = await User.find();
    const participants = await DaycareParticipant.find();

    const userMap = new Map(users.map(u => [u._id.toString(), u]));
    const participantMap = new Map(
      participants.map(p => [p._id.toString(), p])
    );

    // 🔥 mapping ke excel format
    const excelData = tasks.map((task: any) => {
      const user = userMap.get(task.userId);

      const daycareNames = (task.daycareParticipantIds || [])
        .map((id: string) => participantMap.get(id)?.name)
        .filter(Boolean)
        .join(", ");

      return {
        Email: user?.email || task.userId || "-",
        Peserta: daycareNames || "-",
        Status: task.status,
        Tanggal: new Date(task.createdAt).toLocaleDateString("id-ID"),
      };
    });

    // 🔥 buat workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // 🔥 convert ke buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=report-task.xlsx`,
      },
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Export gagal" },
      { status: 500 }
    );
  }
}