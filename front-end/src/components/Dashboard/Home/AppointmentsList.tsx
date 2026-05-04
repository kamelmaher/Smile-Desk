/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import type { Appointment } from "../../../types/Appointment"
import { getAppointmentHour, getAppointmentDate } from "../../../utils/appointments"

type AppointmentsListProps = {
    list: Appointment[]
    title: string
}
const AppointmentsList = ({ list, title }: AppointmentsListProps) => {
    const [selected, setSelected] = useState<any | null>(null);
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-[420px] flex flex-col overflow-x-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">
                    مواعيد {title}
                </h3>
            </div>

            {/* EMPTY */}
            {list.length === 0 && (
                <p className="text-gray-500 text-sm">
                    لا يوجد مواعيد {title}
                </p>
            )}

            {/* LIST */}
            <div className="flex-1 overflow-y-auto space-y-3 relative">

                {list.map((e: any) => {
                    const isSelected = selected?._id === e._id;
                    const isBlurred = selected && !isSelected;

                    return (
                        <div
                            key={e._id}
                            onClick={() =>
                                setSelected(selected?._id === e._id ? null : e)
                            }
                            className={`
                        p-4 rounded-xl transition-all duration-300 cursor-pointer
                        ${isSelected
                                    ? "bg-blue-100 ring-2 ring-blue-300 shadow-md"
                                    : "bg-blue-50 hover:bg-blue-100"}
                        ${isBlurred ? "blur-[2px] opacity-60" : ""}
                        overflow-hidden
                    `}
                        >
                            {/* MAIN INFO */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">

                                <p className="text-gray-700 font-medium">
                                    {getAppointmentHour(e.date)} - {e.patientName}
                                </p>

                                <span
                                    className={`text-sm bg-blue-600 text-white px-3 py-1 rounded-full w-full lg:w-auto text-center lg:text-right`}
                                >
                                    {title === "في الأيام العشر القادمة"
                                        ? getAppointmentDate(e.date)
                                        : "محجوز"}
                                </span>

                            </div>

                            {/* DETAILS */}
                            <div
                                className={`transition-all duration-300 overflow-hidden ${isSelected
                                    ? "max-h-40 mt-3 opacity-100"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>👤 {e.patientName}</p>
                                    <p>🕒 {getAppointmentHour(e.date)}</p>
                                    <p>📅 {getAppointmentDate(e.date)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default AppointmentsList
