import AppointmentsList from "./AppointmentsList"
import { useAppointmentStore } from "../../../store/appointment.store"
import { useAuthStore } from "../../../store/auth.store"
import { useEffect } from "react"
import { useStatics } from "../../../store/statics.store"
import Spinner from "../../Spinner"
import { useClinicStore } from "../../../store/clinic.store"
import { NavLink } from "react-router-dom"

export default function DashboardHome() {
    const { appointments, loading, loadAppointments } = useAppointmentStore()
    const { statics, loading: staticsLoading } = useStatics()
    const { selectedClinic } = useClinicStore()
    const { user } = useAuthStore()
    useEffect(() => {
        loadAppointments({ page: 1, dateRange: "today", status: "accepted" })
    }, [loadAppointments])


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
                        staticsLoading ? <Spinner /> :
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
                    <AppointmentsList title="اليوم" list={appointments} loading={loading} />
                </div>
            </>
        }
    </>
}
