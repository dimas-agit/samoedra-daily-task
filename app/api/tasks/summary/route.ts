import { connectToDatabase } from "@/app/lib/mongodb";
import Task from "@/app/models/Task";
import { verifyToken } from "@/app/lib/auth";

type TaskStatus = "not yet" | "inprogress" | "completed";

export async function GET(request: Request) {
  try {
    // 🔐 Auth
    const user = verifyToken(request);
    if (!user?.userId) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    await connectToDatabase();

    // 🕒 Today range (lebih aman dari timezone issue)
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 📊 Query paralel (lebih cepat)
    const [totalTask, todayTasks] = await Promise.all([
      Task.countDocuments({ userId: user.userId }),
      Task.find({
        userId: user.userId,
        createdAt: { $gte: start, $lte: end },
      }),
    ]);

    // 🔢 Init summary (ANTI NaN)
    const summary = {
      total: totalTask,
      today: todayTasks.length,
      status: {
        "not yet": 0,
        "inprogress": 0,
        "completed": 0,
      } as Record<TaskStatus, number>,
    };

    // 📊 Count status (ONLY TODAY)
    todayTasks.forEach((task) => {
      const statusKey = task.status as TaskStatus;

      if (summary.status[statusKey] !== undefined) {
        summary.status[statusKey]++;
      }
    });

    return new Response(
      JSON.stringify({
        message: "Task summary fetched successfully",
        ...summary, // 🔥 langsung flatten biar gampang di FE
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching task summary:", error);

    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}