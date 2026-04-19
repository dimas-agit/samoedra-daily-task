import { connectToDatabase } from "@/app/lib/mongodb";
import Task from "@/app/models/Task";
import { verifyToken } from "@/app/lib/auth";

export async function GET(request: Request) {
  try {
    // 🔐 Auth
    const user = verifyToken(request);
    if (!user?.userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();

    // 🗓️ Today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 📅 Check hari kerja (Senin–Jumat)
    const day = start.getDay(); // 0 = Minggu, 6 = Sabtu
    const isWorkingDay = day >= 1 && day <= 5;

    // ❌ Jika weekend → tidak ada task wajib
    if (!isWorkingDay) {
      return new Response(
        JSON.stringify({
          count: 0,
          isWorkingDay: false,
          message: "Weekend - no task required",
        }),
        { status: 200 }
      );
    }

    // 🔍 Ambil task hari ini (status tertentu)
    const tasks = await Task.find({
      userId: user.userId,
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["not yet", "inprogress"] },
    });

    // 🎯 Logic utama
    let count = tasks.length;

    // 🔥 Jika belum ada task → tetap 1 (mandatory task)
    if (count === 0) {
      count = 1;
    }

    return new Response(
      JSON.stringify({
        count,
        isWorkingDay: true,
        date: start.toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching daily task:", error);

    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}