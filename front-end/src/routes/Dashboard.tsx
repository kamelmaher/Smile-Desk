import { useEffect } from "react";
import { Outlet } from "react-router";
import Spinner from "../components/Spinner";
import DashboardLinks from "../components/Dashboard/DashboardLinks";
import { useLoadClinic } from "../hooks/useClinics";
import { plans } from "../data/constants";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
    const { data, isLoading } = useLoadClinic()
    const selectedClinic = data?.clinic || null
    const subscription = selectedClinic?.subscription
    const isTrial = subscription?.plan === plans.TRIAL

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
                {isLoading ? <Spinner /> :
                    <>
                        {isTrial && subscription?.trialEndsAt && (
                            <div className="flex flex-col gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800 sm:flex-row sm:items-center sm:justify-between">
                                <span>أنت تستخدم الفترة التجريبية المجانية.</span>
                                <NavLink to="/pricing" className="font-semibold underline">عرض الخطط</NavLink>
                            </div>
                        )}
                        <Outlet />
                    </>}
            </main>
        </div>
    );
}