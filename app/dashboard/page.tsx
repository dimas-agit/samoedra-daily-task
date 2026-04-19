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
      },
    ],
  };

  

  return (
    <div>
 


      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card title="Total Task" value={data?.total} />
        <Card title="Today Task" value={data?.today} />
        <Card title="Not Yet" value={'0'} />
        <Card title="In Progress" value={'0'} />
        <Card title="Completed" value={'0'} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-3 font-semibold">Task Status</h2>
          <Pie data={pieData} />
        </div>

        
      </div>
    </div>
  );
}

// 🔹 Card Component
function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold text-blue-600">{value}</h2>
    </div>
  );
}