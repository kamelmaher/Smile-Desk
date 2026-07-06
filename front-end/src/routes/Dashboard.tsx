import { useEffect } from "react";
import { Outlet } from "react-router";
import Spinner from "../components/Spinner";
import DashboardLinks from "../components/Dashboard/DashboardLinks";
import { useLoadClinic } from "../hooks/useClinics";

export default function Dashboard() {
    const { data, isLoading } = useLoadClinic()
    const selectedClinic = data?.clinic || null

    useEffect(() => {
        scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-[#f6f9fc] flex flex-col md:flex-row">

            <div className="md:hidden z-40 bg-white shadow-sm px-4 py-3">
                <div className="flex flex-wrap gap-2">
                    <DashboardLinks />
                </div>
            </div>

            <aside className="w-64 bg-white border-l border-gray-100 p-6 hidden md:block shadow-sm">
                {
                    selectedClinic &&
                    <>
                        <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight mb-10">
                            {selectedClinic.clinicName}
                        </h1>

                        <nav className="space-y-3 text-gray-600 text-sm flex flex-col gap-2">
                            <DashboardLinks />
                            <p className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mt-8 transition">
                                تسجيل الخروج
                            </p>
                        </nav>
                    </>
                }

            </aside>

            <main className="flex-1 p-4 md:p-8 space-y-8">
                {isLoading ? <Spinner /> : <Outlet />}
            </main>
        </div>
    );
}