import AppointmentsList from "./AppointmentsList"
import { useAuthStore } from "../../../store/auth.store"
import { useState } from "react"
import Spinner from "../../Spinner"
import { NavLink } from "react-router-dom"
import { useLoadAppointments } from "../../../hooks/useAppointments"
import { useLoadClinic } from "../../../hooks/useClinics"
import { useLoadStatics } from "../../../hooks/useStatics"

export default function DashboardHome() {
    const [filters] = useState({ dateRange: "today", status: "", page: 1 })
    const { data, isLoading } = useLoadAppointments(filters)
    const { data: clinic } = useLoadClinic()

    const selectedClinic = clinic?.clinic || null
    const appointments = data?.appointments || []

    const { data: staticsData, isPending } = useLoadStatics(selectedClinic?._id)
    const statics = staticsData?.statics || null
    const { user } = useAuthStore()
    return <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">
                    مرحبا د. {user?.userName}
                </h2>

                <p className="text-gray-500 mt-1">
                    لوحة إدارة العيادة والمواعيد بشكل احترافي
                </p>

            </div>
            <div className="text-sm text-blue-600 font-semibold text-center">
                <p>صفحة العيادة الخاصة بك. شاركها مع الجميع</p>
                <NavLink to={`/clinic/${selectedClinic?.slug}`} className="underline hover:text-blue-800" aria-label="نسخ رابط العيادة">
                    {selectedClinic?.slug}
                </NavLink>
            </div>
        </div>
        {
            <>
                {/* Statics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">حجوزات اليوم</p>
                        <h3 className="text-3xl font-bold text-blue-600 mt-2">{appointments && appointments.length}</h3>
                    </div>

                    {/* Statics */}
                    {
                        isPending ? <Spinner /> :
                            <>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                                    <p className="text-gray-500 text-sm">مجموع الحجوزات </p>
                                    <h3 className="text-3xl font-bold text-blue-600 mt-2">
                                        {statics?.totalAppointments}
                                    </h3>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                                    <p className="text-gray-500 text-sm">بانتظار التأكيد </p>
                                    <h3 className="text-3xl font-bold text-blue-600 mt-2">
                                        {statics?.pendingAppointments}
                                    </h3>
                                </div>

                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                                    <p className="text-gray-500 text-sm">الملغاة </p>
                                    <h3 className="text-3xl font-bold text-blue-600 mt-2">
                                        {statics?.declinedAppointments}
                                    </h3>
                                </div>
                            </>
                    }

                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                        <p className="text-gray-500 text-sm">حالة العيادة</p>
                        <h3 className="text-3xl font-bold text-blue-500 mt-2">
                            نشطة
                        </h3>
                    </div>

                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Schedule */}
                    <AppointmentsList title="اليوم" list={appointments} loading={isLoading} />
                </div>
            </>
        }
    </>
}
