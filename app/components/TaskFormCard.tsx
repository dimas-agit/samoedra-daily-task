"use client";

import { debug } from "console";
import { useEffect, useRef, useState } from "react";

type DayCareParticipants = {
    _id:string,
    name: string;
    age: number;
    dateOfBirth: string
};

// Pastikan type definition jelas
type PopupType = 'success' | 'error';


type TaskForm = {
    id:string,
    userId: string;
    daycareParticipantIds: string[];
    activity1Checked: boolean,
    activity1Note: string,
    activity2Checked: boolean,
    activity2Note: string,
    activity3Checked: boolean,
    activity3Note: string,
    activity4Checked: boolean,
    activity4Note: string,
    activity5Checked: boolean,
    activity5Note: string,
    activity6Checked: boolean,
    activity6Note: string,
    activity7Checked: boolean,
    activity7Note: string,
    activity8Checked: boolean,
    activity8Note: string,
    activity9Checked: boolean,
    activity9Note: string,
    activity10Checked: boolean,
    activity10Note: string,
    activity11Checked: boolean,
    activity11Note: string,
    activity12Checked: boolean,
    activity12Note: string,
    activity13Checked: boolean,
    activity13Note: string,
    activity14Checked: boolean,
    activity14Note: string,
    activityFifteenChecked: boolean,
    activityFifteenNote: string,
    activity16Checked: boolean,
    activity16Note: string,
    activity17Checked: boolean,
    activity17Note: string,
    activity18Checked: boolean,
    activity18Note: string,
    activity19Checked: boolean,
    activity19Note: string,
    activity20Checked: boolean,
    activity20Note: string,
    activity21Checked: boolean,
    activity21Note: string,
    activity22Checked: boolean,
    activity22Note: string,
    activity23Checked: boolean,
    activity23Note: string,
    activity24Checked: boolean,
    activity24Note: string,
     activity25Checked: boolean,
    activity25Note: string,
    status: string
};
export default function TaskFormCard() {
    const selectRef = useRef<HTMLSelectElement | null>(null);   
    const [taskId, setTaskId] = useState<string | null>(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [daycareParticipants, setDaycareParticipants] = useState<DayCareParticipants[]>([]);
    const [message, setMessage] = useState("");
    const [date, setDate] = useState(new Date());
    const [taskData, setTaskData] = useState<TaskForm>({
        id:"" as string,
        userId: "" as string,
        daycareParticipantIds:[],
        activity1Checked: false,
        activity1Note: "",
        activity2Checked: false,
        activity2Note: "",
        activity3Checked: false,
        activity3Note: "",
        activity4Checked: false,
        activity4Note: "",
        activity5Checked: false,
        activity5Note: "",
        activity6Checked: false,
        activity6Note: "",
        activity7Checked: false,
        activity7Note: "",
        activity8Checked: false,
        activity8Note: "",
        activity9Checked: false,
        activity9Note: "",
        activity10Checked: false,
        activity10Note: "",
        activity11Checked: false,
        activity11Note: "",
        activity12Checked: false,
        activity12Note: "",
        activity13Checked: false,
        activity13Note: "",
        activity14Checked: false,
        activity14Note: "",
        activityFifteenChecked: false,
        activityFifteenNote: "",
        activity16Checked: false,
        activity16Note: "",
        activity17Checked: false,
        activity17Note: "",
        activity18Checked: false,
        activity18Note: "",
        activity19Checked: false,
        activity19Note: "",
        activity20Checked: false,
        activity20Note: "",
        activity21Checked: false,
        activity21Note: "",
        activity22Checked: false,
        activity22Note: "",
        activity23Checked: false,
        activity23Note: "",
        activity24Checked: false,
        activity24Note: "",
        activity25Checked: false,
        activity25Note: "",
        
        status: ""
    } as TaskForm);


// TaskFormCard.tsx - Helper function
const getUserIdFromToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    // Decode JWT payload (bagian 10gah)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Common JWT userId fields
    return payload.userId || 
           payload.sub || 
           payload.id || 
           payload._id ||
           null;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};
    // Helper function - letakkan di dalam component
    const mapTasksToFormData = (): Record<string, any> => {
    const formData: Record<string, any> = {};
    
    tasks.forEach((task) => {
        const num = task.id;
        
        // Dynamic field names sesuai database
        formData[`activity${num}Checked`] = task.isChecked;
        formData[`activity${num}Note`] = task.note;
    });
    
    return formData;
    };
    // Popup states
    const [showPopup, setShowPopup] = useState(false);

    // State declaration
    const [popupType, setPopupType] = useState<PopupType | null>(null);
    const [popupMessage, setPopupMessage] = useState('');

    // Close popup function
    const closePopup = () => {
        setShowPopup(false);
        setPopupType(null);
        setPopupMessage('');
    };

    // Show popup helper
    const showPopupMessage = (type: PopupType, message: string) => {
        console.log('Showing popup:', type, message); // Debug log
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);

        // Auto close success after 4s
        if (type === 'success') {
            setTimeout(() => {
                console.log('Auto closing success popup');
                closePopup();
            }, 4000);
        }
    };
    // State untuk selected participant ID
   const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

    // Handler untuk select daycare participant
   

    const [tasks, setTasks] = useState([
        {
            id: 1,
            taskName: 'Hadir Pukul 06.45',
            isChecked: false,
            note: ''
        },
        {
            id: 2,
            taskName: 'Mematikan lampu depan & menyalakan lampu dalam',
            isChecked: false,
            note: ''
        },
        {
            id: 3,
            taskName: 'Membalik tulisan buka tutup',
            isChecked: false,
            note: ''
        },
        {
            id: 4,
            taskName: 'Merapikan area daycare yang berantakan',
            isChecked: false,
            note: ''
        },
        {
            id: 5,
            taskName: 'Menyambut orang tua & menerima anak dengan ramah',
            isChecked: false,
            note: ''
        },
        {
            id: 6,
            taskName: 'Menanyakan kondisi anak (bagaimana tidurnya, sudah mandi & sarapan dll)',
            isChecked: false,
            note: ''
        },
        {
            id: 7,
            taskName: 'Menyiapkan sarapan peserta daycare',
            isChecked: false,
            note: ''
        },
        {
            id: 8,
            taskName: 'Menemani mandi',
            isChecked: false,
            note: ''
        },
        {
            id: 9,
            taskName: 'Menemani bermain',
            isChecked: false,
            note: ''
        },
        {
            id: 10,
            taskName: 'Merapikan barang bawaan peserta daycare',
            isChecked: false,
            note: ''
        },
        {
            id: 11,
            taskName: 'Menyiapkan kegiatan peserta daycare (mengaji/outdoor/stimulasi)',
            isChecked: false,
            note: ''
        },
        {
            id: 12,
            taskName: 'Menyiapkan susu',
            isChecked: false,
            note: ''
        },
        {
            id: 13,
            taskName: 'Menyiapkan makan siang',
            isChecked: false,
            note: ''
        },
          {
            id: 14,
            taskName: 'Ibadah Sholat Zuhur',
            isChecked: false,
            note: ''
        },
        {
            id: 15,
            taskName: 'Menemani tidur siang',
            isChecked: false,
            note: ''
        },
        {
            id: 16,
            taskName: 'Menyiapkan snack',
            isChecked: false,
            note: ''
        },
        {
            id: 17,
            taskName: 'Menemani mandi sore',
            isChecked: false,
            note: ''
        },
        {
            id: 18,
            taskName: 'Menyisir & mengikat rambut',
            isChecked: false,
            note: ''
        },
        {
            id: 19,
            taskName: 'Merapikan pakaian kotor',
            isChecked: false,
            note: ''
        },
        {
            id: 20,
            taskName: 'Merapikan barang bawaan pulang',
            isChecked: false,
            note: ''
        },
        {
            id: 21,
            taskName: 'Mencatat laporan harian',
            isChecked: false,
            note: ''
        },
        {
            id: 22,
            taskName: 'Merapikan kamar & kasur daycare',
            isChecked: false,
            note: ''
        },
        {
            id: 23,
            taskName: 'Menemani main sore',
            isChecked: false,
            note: ''
        },
         {
            id: 24,
            taskName: 'Ibadah Sholat Ashar',
            isChecked: false,
            note: ''
        },
        {
            id: 25,
            taskName: 'Serah terima peserta daycare saat penjemputan',
            isChecked: false,
            note: ''
        }
    ]);
  const handleCheckboxChange = (id: number) => {
  setTasks(prev => {
    const updated = prev.map(task =>
      task.id === id ? { ...task, isChecked: !task.isChecked } : task
    );

    // ✅ sync ke taskData
    setTaskData(prevData => ({
      ...prevData,
      [`activity${id}Checked`]: updated.find(t => t.id === id)?.isChecked,
    }));

    return updated;
  });
};
   const handleNoteChange = (id: number, value: string) => {
  setTasks(prev => {
    const updated = prev.map(task =>
      task.id === id ? { ...task, note: value } : task
    );

    // ✅ sync ke taskData
    setTaskData(prevData => ({
      ...prevData,
      [`activity${id}Note`]: value,
    }));

    return updated;
  });
};



// ✅ Auto-save taskData
useEffect(() => {
  const savedTaskData = localStorage.getItem("daycareTaskData");

  if (savedTaskData) {
    const parsed = JSON.parse(savedTaskData);

    // ✅ restore taskData
    setTaskData(parsed);

    // ✅ IMPORTANT: mapping ke UI tasks
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        isChecked: parsed[`activity${task.id}Checked`] || false,
        note: parsed[`activity${task.id}Note`] || "",
      }))
    );
  }
}, []);

    useEffect(() => {
        const fetchDaycareParticipants = async () => {
            const token = localStorage.getItem("token");
            debugger;
            const res = await fetch("/api/daycare", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setDaycareParticipants(data.daycare || []);
            }
        };
        fetchDaycareParticipants();
    }, []);


    useEffect(() => {
  const init = () => {
    if (typeof window === "undefined") return;

    const $ = (window as any).$;

    if (!$ || !selectRef.current) return;

    // prevent double init
    if ($.fn.select2 && $(selectRef.current).data("select2")) {
      $(selectRef.current).select2("destroy");
    }

    $(selectRef.current).select2({
      placeholder: "Pilih peserta",
      width: "100%",
    });

    $(selectRef.current).on("change", (e: any) => {
      const values = Array.from(e.target.selectedOptions).map(
        (o: any) => o.value
      );

      setSelectedParticipantIds(values);
    });
  };

  // delay biar script CDN ready
  setTimeout(init, 300);

  return () => {
    const $ = (window as any).$;
    if ($ && $.fn.select2 && selectRef.current) {
      $(selectRef.current).select2("destroy");
    }
  };
}, []);

  useEffect(() => {
    debugger;
  const savedTaskId = localStorage.getItem("taskId");

  if (!savedTaskId) return;

  setTaskId(savedTaskId);

  const fetchDataTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/tasks/${savedTaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Task not found");
        return;
      }

      const result = await res.json(); // ✅ FIX (await)
      const task = result.data;        // ✅ ambil dari data

      if (!task) return;

      // ✅ set state utama
      setSelectedParticipantIds(task.daycareParticipantIds || []);
      setStatus(task.status);

      // ✅ mapping ke UI checklist
      setTasks(prev =>
        prev.map(t => ({
          ...t,
          isChecked: task[`activity${t.id}Checked`] || false,
          note: task[`activity${t.id}Note`] || "",
        }))
      );

    } catch (error) {
      console.error("Fetch task error:", error);
    }
  };

  fetchDataTask(); // ✅ WAJIB dipanggil

}, []);


const resetForm = () => {
  // reset participant
  setSelectedParticipantIds([]);

  // reset status
  setStatus("not yet");

  // reset checklist (25 task)
  setTasks(prev =>
    prev.map(t => ({
      ...t,
      isChecked: false,
      note: "",
    }))
  );

  // reset select2 UI (IMPORTANT kalau pakai select2)
  if (selectRef.current && (window as any).$) {
    (window as any).$(selectRef.current).val(null).trigger("change");
  }
};
  const handleSubmit = async (actionType: "save" | "submit") => {
  if (loading) return;
  
  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showPopupMessage('error', '🔐 Silakan login terlebih dahulu!');
      return;
    }
    debugger;
    if(actionType === "save"){
        setStatus(prev=>{
            return "inprogress"
        })
    
      
    }
    else{
       setStatus(prev=>{
            return "completed"
        })
    }
    // Ambil userId dari token (adjust sesuai JWT structure)
    const userId = getUserIdFromToken();
    if (!userId) {
      showPopupMessage('error', '🔐 User ID tidak ditemukan. Silakan login ulang!');
      localStorage.removeItem("token");
      return;
    }

    // VALIDASI
    if (!selectedParticipantIds) {
      showPopupMessage('error', '👶 Silakan pilih peserta daycare!');
      return;
    }

    // Map tasks ke database format
    const activitiesData = mapTasksToFormData();

    const submitData = {
      id:taskId,
      userId,
      daycareParticipantIds: selectedParticipantIds,
      status: actionType === "save" ? "inprogress" : "completed",
      ...activitiesData, // ✅ Semua activity1-23 mapped otomatis!
    };

    console.log('Submitting data:', submitData);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(submitData),
    });

    const result = await res.json();

    if (result?.data?.id) {
  setTaskId(result.data.id);

  localStorage.setItem("taskId", result.data.id); // ✅ penting
}

    if (!res.ok) {
      throw new Error(result.message || `HTTP ${res.status}`);
    }

    const successMsg = actionType === "save" 
      ? "💾 Draft tersimpan aman!" 
      : "🎉 Semua task selesai! Terima kasih!";
    
    showPopupMessage('success', successMsg);
    
    // Reset form jika submit
   if (actionType === "submit") {
    localStorage.removeItem("taskId");
    localStorage.removeItem("daycareTaskData");
    localStorage.removeItem("daycareStatus");

    resetForm();
    }
    
    
  } catch (error: any) {
    console.error('Submit error:', error);
    showPopupMessage('error', error.message || 'Gagal mengirim data');
  } finally {
    setLoading(false);
  }
};
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header - sama persis */}
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 mb-8 border border-white/50">
                    <div className="text-center mb-8">
                        {/* <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-pink-400 px-6 py-3 rounded-2xl shadow-lg mb-4">
          <span className="text-3xl">🌈</span>
        
        </div> */}
                        <p className="text-lg text-gray-600 font-medium">Lacak aktivitas harian anak-anak dengan mudah! ✨</p>
                    </div>

                    {/* Form Header - sama persis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                📅 Tanggal
                            </label>
                            <input
                                type="date"
                                className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 hover:shadow-xl text-lg font-medium"
                                value={date.toISOString().split('T')[0]}
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                👶 Peserta Daycare
                            </label>
                            <select
                                ref={selectRef}
                                multiple
                                className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 hover:shadow-xl text-lg font-medium appearance-none"
                                value={selectedParticipantIds}
                               onChange={(e) => {
                                const values = Array.from(
                                    e.target.selectedOptions,
                                    option => option.value
                                );

                                setSelectedParticipantIds(values);
                                }}
                            >
                                 {daycareParticipants.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
                            </select>
                        </div>
                    </div>


                </div>

                {/* Tasks - Card Style Responsive */}
                <div className="space-y-4 mb-8">

                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="group bg-white/90 backdrop-blur-xl shadow-xl hover:shadow-2xl rounded-3xl p-6 border border-white/50 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
                                {/* Task Number & Title - sama persis */}
                                <div className="flex items-center gap-4 mb-6 lg:mb-0 lg:flex-1">
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-xl drop-shadow-md">{task.id}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-gray-900 text-md md:text-md leading-tight group-hover:text-purple-700 transition-colors">
                                            {task.taskName}
                                        </h4>
                                    </div>
                                </div>

                                {/* ✅ SIMPLE CHECKBOX - Kosong → Centang Hijau */}
                                <div className="flex items-center justify-center mb-6 lg:mb-0 lg:w-24">
                                    <label className="cursor-pointer p-3 transition-all duration-200 hover:scale-110">
                                        <input
                                            type="checkbox"
                                            id={`task-${task.id}`}
                                            checked={task.isChecked}
                                            onChange={() => handleCheckboxChange(task.id)}
                                            className="sr-only peer"
                                        />
                                        <div className={`
                  w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 ease-in-out
                  border-4 border-gray-300
                  peer-checked:border-green-500 peer-checked:bg-green-500
                  peer-checked:shadow-green-300 peer-checked:shadow-xl
                  hover:shadow-md hover:border-gray-400
                  peer-focus:ring-4 peer-focus:ring-green-200
                  group-hover:scale-105
                  ${task.isChecked
                                                ? 'scale-110 rotate-5'
                                                : 'scale-100 rotate-0'
                                            }
                `}>
                                            {/* Centang Hijau - Hanya muncul saat checked */}
                                            <svg
                                                className={`
                      w-7 h-7 mx-auto mt-1 transition-all duration-300 ease-in-out
                      ${task.isChecked
                                                        ? 'opacity-100 scale-100 translate-y-0 delay-150'
                                                        : 'opacity-0 scale-75 -translate-y-2'
                                                    }
                    `}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                style={{ color: '#ffff' }}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </label>
                                </div>

                                {/* Note Input - sama persis */}
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        id={`note-${task.id}`}
                                        value={task.note}
                                        onChange={(e) => handleNoteChange(task.id, e.target.value)}
                                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-white to-gray-50 shadow-inner focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 hover:shadow-md text-base placeholder-gray-400 font-medium"
                                        placeholder="✍️ Catatan ..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons - sama persis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
                    <button
                        onClick={() => handleSubmit("save")}
                        disabled={loading}
                        className=" cursor-pointer group relative overflow-hidden bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>💾 Simpan Draft</span>
                        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-2xl transition-transform duration-300"></div>
                    </button>

                    <button
                        onClick={() => handleSubmit("submit")}
                        disabled={loading}
                        className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>✅ Submit & Selesai</span>
                        <div className="absolute inset-0 bg-white/30 scale-0 group-hover:scale-150 rounded-2xl transition-transform duration-300"></div>
                    </button>
                </div>

                {/* Success Message - sama persis */}
                {/* Full Screen Popup - Letakkan di paling bawah component */}
                {showPopup && popupType && (
                    <div
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
                        onClick={closePopup}
                    >
                        <div
                            className={`
        w-full max-w-lg mx-4 p-8 lg:p-12 rounded-3xl shadow-2xl border-8
        transform animate-popupSlideIn duration-500
        relative overflow-hidden
        ${popupType === 'success'
                                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400 shadow-emerald-500/50'
                                    : 'bg-gradient-to-br from-rose-400 to-red-500 border-rose-400 shadow-rose-500/50'
                                }
      `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                {popupType === 'success' ? (
                                    <div className="w-full h-full bg-[radial-gradient(circle_at_20%_80%,#34D399_0%,transparent_50%)]"></div>
                                ) : (
                                    <div className="w-full h-full bg-[radial-gradient(circle_at_20%_80%,#F87171_0%,transparent_50%)]"></div>
                                )}
                            </div>

                            {/* Con10t */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="flex items-center justify-center mb-8">
                                    <div className={`
            w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl border-4
            ${popupType === 'success'
                                            ? 'bg-white/30 border-emerald-300 shadow-emerald-300/50'
                                            : 'bg-white/30 border-rose-300 shadow-rose-300/50'
                                        }
          `}>
                                        {popupType === 'success' ? (
                                            <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-16 h-16 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl lg:text-4xl font-black text-white text-center mb-6 drop-shadow-2xl leading-tight">
                                    {popupType === 'success' ? 'Sukses!' : 'Oops!'}
                                </h3>

                                {/* Message */}
                                <p className="text-xl lg:text-2xl text-white/95 text-center font-semibold mb-10 px-6 leading-relaxed drop-shadow-lg">
                                    {popupMessage}
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={closePopup}
                                        className="flex-1 bg-white/25 backdrop-blur-xl text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/40 transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-white/40 active:scale-95"
                                    >
                                        {popupType === 'success' ? 'Lanjut' : 'Tutup'}
                                    </button>

                                    {popupType === 'error' && (
                                        <button
                                            onClick={() => handleSubmit("submit")}
                                            disabled={true}
                                            className="flex-1 bg-white text-rose-600 py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-3xl border-2 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                        >
                                            {loading ? '⏳ Loading...' : 'Coba Lagi'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}