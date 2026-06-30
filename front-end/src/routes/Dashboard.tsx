import { useEffect } from "react";
import { Outlet } from "react-router";
import Spinner from "../components/Spinner";
import { useClinicStore } from "../store/clinic.store";
import DashboardLinks from "../components/Dashboard/DashboardLinks";
import { useAppointmentStore } from "../store/appointment.store";
import { useStatics } from "../store/statics.store";

export default function Dashboard() {
    const { getUserClinic, selectedClinic, loading } = useClinicStore()
    const { getTodayAppointments } = useAppointmentStore()

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                getUserClinic(),
                getTodayAppointments(),
            ])
        }
        loadData()
    }, [getTodayAppointments, getUserClinic])
    const { getStatics } = useStatics()

    useEffect(() => {
        getUserClinic()
    }, [getUserClinic])

    useEffect(() => {
        scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (!selectedClinic._id) return
        getStatics(selectedClinic._id)
    }, [getStatics, selectedClinic])

    return (
        <div className="min-h-screen bg-[#f6f9fc] flex flex-col md:flex-row">

            {/* 📱 Mobile / Tablet Top Bar */}
            <div className="md:hidden z-40 bg-white shadow-sm px-4 py-3">
                <div className="flex flex-wrap gap-2">
                    <DashboardLinks />
                </div>
            </div>

            {/* 💻 Sidebar (Desktop only) */}
            <aside className="w-64 bg-white border-l border-gray-100 p-6 hidden md:block shadow-sm">
                <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight mb-10">
                    {selectedClinic.clinicName}
                </h1>

                <nav className="space-y-3 text-gray-600 text-sm flex flex-col gap-2">
                    <DashboardLinks />
                    <p className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mt-8 transition">
                        تسجيل الخروج
                    </p>
                </nav>
            </aside>

            {/* 🧠 Main Content */}
            <main className="flex-1 p-4 md:p-8 space-y-8">
                {loading ? <Spinner /> : <Outlet />}
            </main>
        </div>
    );
}