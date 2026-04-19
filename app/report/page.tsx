"use client";

import { Fragment, useEffect, useState } from "react";

type TaskDetail = {
  no: number;
  question: string;
  checked: boolean;
  note: string;
};
type Task = {
  userEmail: string;
  daycareParticipants: string;
  status: string;
  date: string;
  details: TaskDetail[]; // ✅ tambahan penting
};

export default function ReportPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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
     <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

  <div className="overflow-x-auto">
    <table className="w-full text-sm">

      {/* HEADER */}
      <thead className="bg-gradient-to-r from-blue-100/70 to-indigo-100/70 backdrop-blur sticky top-0 z-10">
        <tr className="text-gray-700 text-sm uppercase tracking-wide">
          <th className="p-4 w-12"></th>
          <th className="p-4 text-left">👤 Email</th>
          <th className="p-4 text-left">👶 Peserta</th>
          <th className="p-4 text-left">📌 Status</th>
          <th className="p-4 text-left">📅 Tanggal</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {/* LOADING */}
        {loading && (
          <tr>
            <td colSpan={5} className="text-center py-10 text-gray-400">
              ⏳ Loading data...
            </td>
          </tr>
        )}

        {/* EMPTY */}
        {!loading && tasks.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center py-10 text-gray-400">
              😢 Tidak ada data
            </td>
          </tr>
        )}

        {/* DATA */}
        {!loading &&
          tasks.map((task, index) => (
            <Fragment key={index}>
              
              {/* 🔹 MAIN ROW */}
              <tr
                className={`
                  border-t transition-all duration-200
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  hover:bg-blue-50/60
                `}
              >
                {/* TOGGLE */}
                <td className="p-4">
                  <button
                    onClick={() =>
                      setExpandedRow(expandedRow === index ? null : index)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition"
                  >
                    <span className="text-blue-600 text-sm">
                      {expandedRow === index ? "−" : "+"}
                    </span>
                  </button>
                </td>

                {/* EMAIL */}
                <td className="p-4 font-semibold text-gray-800">
                  {task.userEmail}
                </td>

                {/* PESERTA */}
                <td className="p-4 text-gray-600">
                  {task.daycareParticipants || "-"}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                      ${getStatusBadge(task.status)}
                    `}
                  >
                    {task.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="p-4 text-gray-500">
                  {new Date(task.date).toLocaleDateString("id-ID")}
                </td>
              </tr>

              {/* 🔥 DETAIL EXPAND */}
              {expandedRow === index && (
                <tr className="bg-gradient-to-br from-gray-50 to-white">
                  <td colSpan={5} className="p-6">
                    
                    <div className="rounded-2xl border border-gray-200 shadow-inner overflow-hidden">
                      <table className="w-full text-xs">

                        {/* HEADER DETAIL */}
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="p-3 w-12 text-center">No</th>
                            <th className="p-3 text-left">Pertanyaan</th>
                            <th className="p-3 w-20 text-center">Status</th>
                            <th className="p-3 text-left">Keterangan</th>
                          </tr>
                        </thead>

                        {/* BODY DETAIL */}
                        <tbody>
                          {task.details.map((d: any, i: number) => (
                            <tr
                              key={d.no}
                              className={`
                                border-t transition
                                ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                hover:bg-indigo-50/40
                              `}
                            >
                              <td className="p-3 text-center font-medium text-gray-500">
                                {d.no}
                              </td>

                              <td className="p-3 text-gray-700">
                                {d.question}
                              </td>

                              <td className="p-3 text-center">
                                <span
                                  className={`
                                    px-2 py-1 rounded-full text-[10px] font-bold
                                    ${
                                      d.checked
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }
                                  `}
                                >
                                  {d.checked ? "DONE" : "MISS"}
                                </span>
                              </td>

                              <td className="p-3 text-gray-600 italic">
                                {d.note || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </td>
                </tr>
              )}
            </Fragment>
          ))}
      </tbody>
    </table>
  </div>

      </div>
    </div>
  );
}