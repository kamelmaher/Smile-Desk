import { AppointmentFilter } from "../../../data/AppointmentsFilter"
import { useAppointmentStore } from "../../../store/appointment.store";



const AppointmentsFilter = () => {
    const { filters, setFilters } = useAppointmentStore()
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

            {/* Filter Select */}
            <div className="relative w-full sm:w-64">
                <select
                    className="w-full appearance-none px-4 py-3 pr-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition outline-none cursor-pointer"
                    defaultValue=""
                    onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
                >
                    {
                        Object.values(AppointmentFilter).map(item => <option key={item.text} value={item.value}>
                            {item.text}
                        </option>)
                    }
                </select>

                {/* Arrow icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                </div>
            </div>
            <div className="relative w-full sm:w-64">
                <select
                    className="w-full appearance-none px-4 py-3 pr-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition outline-none cursor-pointer"
                    defaultValue=""
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">جميع الحالات</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="accepted">مقبول</option>
                    <option value="declined">مرفوض</option>
                </select>

                {/* Arrow icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                </div>
            </div>
        </div >
    )
}

export default AppointmentsFilter
