
import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/Task";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/lib/auth";
import Task from "@/app/models/Task";
import { connect } from "http2";
import { randomUUID } from "crypto";
import User from "@/app/models/User";
import DaycareParticipant from "@/app/models/DaycareParticipant";
const QUESTIONS = [
  "Hadir Pukul 06.45",
  "Mematikan lampu depan & menyalakan lampu dalam",
  "Membalik tulisan buka tutup",
  "Merapikan area daycare yang berantakan",
  "Menyambut orang tua & menerima anak dengan ramah",
  "Menanyakan kondisi anak",
  "Menyiapkan sarapan peserta daycare",
  "Menemani mandi",
  "Menemani bermain",
  "Merapikan barang bawaan peserta daycare",
  "Menyiapkan kegiatan peserta daycare",
  "Menyiapkan susu",
  "Menyiapkan makan siang",
  "Ibadah Sholat Zuhur",
  "Menemani tidur siang",
  "Menyiapkan snack",
  "Menemani mandi sore",
  "Menyisir & mengikat rambut",
  "Merapikan pakaian kotor",
  "Merapikan barang bawaan pulang",
  "Mencatat laporan harian",
  "Merapikan kamar & kasur daycare",
  "Menemani main sore",
  "Ibadah Sholat Ashar",
  "Serah terima peserta daycare",
];

export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  const query: any = {};

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59);

    query.createdAt = { $gte: start, $lte: end };
  }

  if (status) {
    query.status = status;
  }

  const tasks = await Task.find(query).lean();

  const users = await User.find().lean();
  const daycares = await DaycareParticipant.find().lean();

  const result = tasks.map((task: any) => {
    const user = users.find(u => u._id.toString() === task.userId);

    const participants = (task.daycareParticipantIds || [])
      .map((id: string) => {
        const d = daycares.find(x => x._id.toString() === id);
        return d?.name;
      })
      .filter(Boolean)
      .join(",");

    // 🔥 mapping 25 soal
    const details = QUESTIONS.map((q, i) => {
      const idx = i + 1;
      return {
        no: idx,
        question: q,
        checked: task[`activity${idx}Checked`] || false,
        note: task[`activity${idx}Note`] || "",
      };
    });

    return {
      userEmail: user?.email || "-",
      daycareParticipants: participants,
      status: task.status,
      date: task.createdAt,
      details, // ✅ penting
    };
  });

  return Response.json({ data: result });
}