import Spinner from "../../Spinner";
import Appointment from "./Appointment";
import { useEffect, useMemo, useState } from "react";
import AppointmentsFilter from "./AppointmentsFilter";
import { appointmentStatus } from "../../../data/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAppointmentStore } from "../../../store/appointment.store";
import Pagination from "../../Paginiation";

export default function Appointments() {

    const { appointments, loading, setPage, page, totalPages, upComingAppointments, todayAppointments, expiredAppointments, search, searchResults } = useAppointmentStore()
    const [selectedType, setSelectedType] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const debounce = useDebounce(searchTerm, 500)

    const handleChangeType = (type: string) => {
        setSelectedType(type)
        setSearchTerm("")
    }
    const handlePageChange = (page: number) => setPage(page)

    useEffect(() => {
        if (debounce.trim()) {
            search(debounce)
        }
    }, [debounce, search])

    const filteredAppointments = useMemo(() => {

        if (debounce.trim()) {
            return searchResults
        }

        switch (selectedType) {
            case "today":
                return todayAppointments
            case "upcoming":
                return upComingAppointments
            case "expired":
                return expiredAppointments
            default:
                return appointments
        }

    }, [
        debounce,
        searchResults,
        selectedType,
        appointments,
        todayAppointments,
        upComingAppointments,
        expiredAppointments
    ])

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">المواعيد</h2>
                <p className="text-gray-500">إدارة جميع مواعيد العيادة</p>
            </div>

            {/* Filters */}
            <AppointmentsFilter handleChangeType={handleChangeType} handleSearch={setSearchTerm} />
            {
                loading ? <Spinner /> :
                    <>
                        {/* Appointments List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {
                                filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((appointment) => (
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
                            (selectedType == "" || selectedType == appointmentStatus.declined) &&
                            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        }
                    </>
            }

        </div >
    );
}