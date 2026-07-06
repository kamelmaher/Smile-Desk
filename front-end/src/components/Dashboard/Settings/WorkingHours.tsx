/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { DEFAULT_CLINIC_WORKING_HOURS, DAYS } from "../../../data/clinic";
import Spinner from "../../Spinner";
import { useLoadClinic, useUpdateClinic } from "../../../hooks/useClinics";



export default function WorkingHours() {
    const { mutateAsync: updateClinic, isPending } = useUpdateClinic()
    const { data } = useLoadClinic()
    const selectedClinic = data?.clinic || null
    const [workingHours, setWorkingHours] = useState(DEFAULT_CLINIC_WORKING_HOURS);

    useEffect(() => {
        if (selectedClinic && selectedClinic.workingHours)
            setWorkingHours(selectedClinic.workingHours.length > 0 ? selectedClinic.workingHours : DEFAULT_CLINIC_WORKING_HOURS)
    }, [selectedClinic])

    const toggleDay = (day: number) => {
        setWorkingHours((prev) =>
            prev.map((d) =>
                d.day === day ? { ...d, isOpen: !d.isOpen } : d
            )
        );
    };

    const handleTimeChange = (
        day: number,
        field: "start" | "end",
        value: string
    ) => {
        setWorkingHours((prev) =>
            prev.map((d) =>
                d.day === day ? { ...d, [field]: value } : d
            )
        );
    };

    const handleSave = async () => {
        console.log("DATA TO SEND:", workingHours);
        await updateClinic({ workingHours })
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6" dir="rtl">

            <h2 className="text-lg font-bold text-gray-800">
                أوقات العمل
            </h2>

            <div className="space-y-3">

                {workingHours.map((day) => (
                    <div
                        key={day.day}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 border border-gray-100 rounded-xl"
                    >

                        {/* Day + Toggle */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={day.isOpen}
                                onChange={() => toggleDay(day.day)}
                                className="w-5 h-5 accent-blue-600"
                            />

                            <span className="font-medium text-gray-700">
                                {DAYS.find((d) => d.key === day.day)?.label}
                            </span>
                        </div>

                        {/* Time Inputs */}
                        {day.isOpen && (
                            <div className="flex items-start gap-2 flex-col sm:flex-row">

                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500">من</label>
                                    <input
                                        type="time"
                                        value={day.start}
                                        onChange={(e) =>
                                            handleTimeChange(day.day, "start", e.target.value)
                                        }
                                        className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <span className="text-gray-400">—</span>

                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500">إلى</label>
                                    <input
                                        type="time"
                                        value={day.end}
                                        onChange={(e) =>
                                            handleTimeChange(day.day, "end", e.target.value)
                                        }
                                        className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                            </div>
                        )}

                    </div>
                ))}

            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
                {
                    isPending ? <Spinner /> :
                        "حفظ أوقات العمل"
                }
            </button>

        </div>
    );
}