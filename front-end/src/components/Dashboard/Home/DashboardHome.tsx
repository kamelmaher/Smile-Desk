import { useAppointmentStore } from "../../../store/appointment.store"
import { useAuthStore } from "../../../store/auth.store"
import Spinner from "../../Spinner"
import AppointmentsList from "./AppointmentsList"

export default function DashboardHome() {
    const { todayAppointments, upComingAppointments, loading } = useAppointmentStore()
    const { user } = useAuthStore()
    return <>
        {/* Header */}
        <div>
            <h2 className="text-3xl font-bold text-gray-900">
                مرحبا د. {user?.userName}
            </h2>

            <p className="text-gray-500 mt-1">
                لوحة إدارة العيادة والمواعيد بشكل احترافي
            </p>

        </div>
        {
            loading ?
                <Spinner />
                :
                <>
                    {/* Statics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <p className="text-gray-500 text-sm">حجوزات اليوم</p>
                            <h3 className="text-3xl font-bold text-blue-600 mt-2">{todayAppointments.length}</h3>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <p className="text-gray-500 text-sm">الحجوزات القادمة</p>
                            <h3 className="text-3xl font-bold text-emerald-600 mt-2">{upComingAppointments.length}</h3>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                            <p className="text-gray-500 text-sm">حالة العيادة</p>
                            <h3 className="text-3xl font-bold text-blue-500 mt-2">
                                نشطة
                            </h3>
                        </div>

                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Schedule */}
                        <AppointmentsList title="اليوم" list={todayAppointments} />
                        {/* Upcoming */}
                        <AppointmentsList title="قادمة" list={upComingAppointments} />

                    </div>
                </>
        }
    </>
}
