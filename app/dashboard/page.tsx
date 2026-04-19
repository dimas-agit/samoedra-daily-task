"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Spinner from "@/app/components/spinner";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Navigation from "../components/navigation";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { loading } = useAuth();
    const [data, setData] = useState<any>({
    total: 0,
    today: 0,
    status: {
        "not yet": 0,
        "inprogress": 0,
        "completed": 0,
    }
    });

 useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    
    const res = await fetch("/api/tasks/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    debugger;
    const  result = await res.json(); 
    
    setData({
      total: result?.total ?? 0,
      today: result?.today ?? 0,
      status: {
        "not yet": result?.status?.["not yet"] ?? 0,
        "inprogress": result?.status?.inprogress ?? 0,
        "completed": result?.status?.completed ?? 0,
      }
    });
  };

  fetchData();
}, []);

  if (loading || !data) return <Spinner />;

  // 📊 Pie (Status)
  const pieData = {
  labels: ["Not Yet", "In Progress", "Completed"],
  datasets: [
    {
      data: [
        data?.status?.["not yet"] ?? 0,
        data?.status?.inprogress ?? 0,
        data?.status?.completed ?? 0,
      ],
      backgroundColor: [
        "#F87171", // red
        "#FBBF24", // yellow
        "#34D399", // green
      ],
      borderWidth: 0,
      hoverOffset: 8,
    },
  ],
};

const pieOptions = {
  plugins: {
    legend: {
      display: false, // ❌ kita bikin custom legend
    },
  },
  cutout: "65%", // ✅ donut effect
};
  

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

    {/* HEADER */}
    <h1 className="text-2xl font-bold text-gray-800">
      📊 Dashboard Task
    </h1>

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card title="Total" value={data.total} color="blue" />
      <Card title="Today" value={data.today} color="purple" />
      <Card title="Not Yet" value={data.status["not yet"]} color="red" />
      <Card title="Progress" value={data.status.inprogress} color="yellow" />
      <Card title="Done" value={data.status.completed} color="green" />
    </div>

    {/* CHART */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* DONUT */}
     <div className="space-y-6">

  {/* ✅ FULL WIDTH CHART */}
  <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
    <h2 className="mb-4 font-semibold text-gray-700">
      📌 Task Status
    </h2>

    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* CHART */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-64 md:w-72">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* LEGEND */}
      <div className="w-full md:w-1/2 space-y-3">
        <LegendItem color="bg-red-400" label="Not Yet" value={data.status["not yet"]} />
        <LegendItem color="bg-yellow-400" label="In Progress" value={data.status.inprogress} />
        <LegendItem color="bg-green-400" label="Completed" value={data.status.completed} />
      </div>

    </div>
  </div>

</div>

    </div>
  </div>
  );
}

function Card({ title, value, color }: any) {
  const colors: any = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-400 to-red-500",
    yellow: "from-yellow-400 to-yellow-500",
    green: "from-green-400 to-green-500",
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} text-white p-5 rounded-2xl shadow-lg`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function LegendItem({ color, label, value }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full ${color}`}></div>
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}