/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useGetBooked } from "../hooks/useAppointments";
import type { WorkingHours } from "../types/Clinic";
import Spinner from "./Spinner";
import { getAvailableHours, getMinDate, isWorkingDay } from "../utils/appointments";
import dayjs from "dayjs";

type Props = {
    workingHours: WorkingHours[];
    onSelect: (dateTime: string) => void;
};

export default function TimeSelector({ workingHours, onSelect }: Props) {
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [booked, setBooked] = useState<string[]>([])
    const isoDate = date ? new Date(date).toISOString().split("T")[0] : ""
    const { data: bookedRes, isLoading: bookedLoading } = useGetBooked(isoDate)

    useEffect(() => {
        if (!date) return
        if (!isWorkingDay(workingHours, date)) {
            setBooked([])
            return
        }
        setBooked((bookedRes && bookedRes.data) || [])
    }, [date, bookedRes, workingHours])

    // Generate Slots
    useEffect(() => {
        if (!date) return;
        setSlots(getAvailableHours(workingHours, date))
        setSelected(null)
    }, [date, workingHours]);

    useEffect(() => {
        if (!date || selected === null) return;

        const [hours, minutes] = selected.split(":").map(Number);

        const selectedDate = dayjs(date)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0);

        onSelect(selectedDate.toISOString());
    }, [date, onSelect, selected]);

    return (
        <div className="space-y-4">

            <div>
                <label>التاريخ</label>
                <input
                    type="date"
                    min={getMinDate()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-2 rounded-xl p-3 border border-gray-300 bg-white text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>

            {/* ⏰ TIME */}
            {bookedLoading ? (
                <Spinner />
            ) : (
                slots.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            اختر الوقت المناسب
                        </label>

                        <div className="relative">
                            <select
                                value={selected || ""}
                                onChange={(e) => setSelected(e.target.value)}
                                className="
                        w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="">
                                    اختر موعدًا متاحًا
                                </option>

                                {slots.map((h) => {
                                    const isBooked = booked.includes(h);

                                    return (
                                        <option
                                            key={h}
                                            value={h}
                                            disabled={isBooked}
                                        >
                                            {isBooked
                                                ? `${h} - محجوز`
                                                : h}
                                        </option>
                                    );
                                })}
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                ▼
                            </div>
                        </div>

                        {selected && (
                            <p className="text-sm text-blue-600">
                                الموعد المختار: {selected} بتاريخ {date}
                            </p>
                        )}
                    </div>
                )
            )}

            {/* ❌ لا يوجد مواعيد */}
            {date && slots.length === 0 && (
                <p className="text-red-500">هذا اليوم غير متاح</p>
            )}

        </div >
    );
}