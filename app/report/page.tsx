"use client";

import { useEffect, useState } from "react";

type Task = {
  userEmail: string;
  daycareParticipants: string;
  status: string;
  date: string;
};

export default function ReportPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ filter state
  const [filter, setFilter] = useState({
    date: new Date().toISOString().split("T")[0],
    status: "",
  });

  // 🔥 fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const query = new URLSearchParams({
        status: filter.status,
        date: filter.date,
      });

      const res = await fetch(`/api/tasks/report?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setTasks(result.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not yet":
        return "bg-gray-200 text-gray-700";
      case "inprogress":
        return "bg-yellow-200 text-yellow-800";
      case "completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // 🔥 export excel
  const handleExport = () => {
    window.open(
      `/api/tasks/export?status=${filter.status}&date=${filter.date}`
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📊 Report Task
        </h1>
        <p className="text-gray-500 text-sm">
          Monitoring aktivitas daycare harian
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col md:flex-row md:items-end gap-4">

        {/* DATE */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">📅 Tanggal</label>
          <input
            type="date"
            value={filter.date}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-xl px-3 py-2 shadow-sm"
          />
        </div>

        {/* STATUS */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">📌 Status</label>
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="border border-gray-200 focus:ring-2 focus:ring-blue-400 rounded-xl px-3 py-2 shadow-sm"
          >
            <option value="">All Status</option>
            <option value="not yet">Not Yet</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-2 md:mt-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "⏳ Loading..." : "🔍 Filter"}
          </button>

          <button
            onClick={handleExport}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl shadow-md transition-all"
          >
            ⬇️ Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            
            {/* HEADER */}
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-semibold">👤 Email</th>
                <th className="p-4 text-left font-semibold">👶 Peserta</th>
                <th className="p-4 text-left font-semibold">📌 Status</th>
                <th className="p-4 text-left font-semibold">📅 Tanggal</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    ⏳ Loading data...
                  </td>
                </tr>
              )}

              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    😢 Tidak ada data
                  </td>
                </tr>
              )}

              {!loading &&
                tasks.map((task, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-blue-50/40 transition-all"
                  >
                    {/* EMAIL */}
                    <td className="p-4 font-medium text-gray-800">
                      {task.userEmail}
                    </td>

                    {/* PESERTA */}
                    <td className="p-4 text-gray-600">
                      {task.daycareParticipants}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusBadge(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-gray-500">
                      {new Date(task.date).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}