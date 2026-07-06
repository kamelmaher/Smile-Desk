import Spinner from "../../Spinner";
import Appointment from "./Appointment";
import AppointmentsFilter from "./AppointmentsFilter";
import Pagination from "../../Paginiation";
import { useLoadAppointments } from "../../../hooks/useAppointments";
import { useAppointmentStore } from "../../../store/appointment.store";

export default function Appointments() {
    const { filters, setFilters } = useAppointmentStore()
    const { data, isLoading, isError } = useLoadAppointments(filters)

    const appointments = (data && data.appointments) || []
    const totalPages = (data && data.pages) || 0

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">المواعيد</h2>
                <p className="text-gray-500">إدارة جميع مواعيد العيادة</p>
            </div>

            <AppointmentsFilter />

            {
                isLoading ? <Spinner /> : isError ? <p className="text-red-600">فشل تحميل المواعيد</p> :
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {
                                appointments.length > 0 ? (
                                    appointments.map((appointment) => (
                                        <Appointment
                                            key={appointment._id}
                                            appointment={appointment}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">لا يوجد مواعيد</p>
                                )}
                        </div>
                        {
                            <Pagination page={filters?.page || 1} totalPages={totalPages} onPageChange={(page) => setFilters({ ...filters, page })} />
                        }
                    </>
            }
        </div >
    );
}