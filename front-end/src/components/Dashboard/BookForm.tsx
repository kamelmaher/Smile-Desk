import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { appointmentSchema } from "../../data/Schemas";
import type { Appointment } from "../../types/Appointment";
import TimeSelector from "../TimeSelector";
import Spinner from "../Spinner";
import { useCreateAppointment } from "../../hooks/useAppointments";
import { useLoadClinicBySlug } from "../../hooks/useClinics";


export default function BookingForm() {
    const { slug } = useParams()
    const { mutateAsync: createAppointment, isPending: loading, error: err } = useCreateAppointment()
    const { data } = useLoadClinicBySlug(slug || "")
    const selectedClinic = data?.clinic || null
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        patientName: "",
        patientAddress: "",
        patientEmail: "",
        date: "",
        patientPhoneNumber: "",
        notes: "",
    } as Appointment);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug) return
        if (!selectedClinic._id) return
        const result = appointmentSchema.safeParse(formData)
        if (result.success) {
            await createAppointment({ ...formData, clinicId: selectedClinic._id })
            setOpen(false)
            setFormData({} as Appointment)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSelect = useCallback((dateTime: string) => {
        setFormData(prev => ({
            ...prev,
            date: dateTime
        }));
    }, []);

    return (
        <>
            {/* زر الحجز */}
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
            >
                حجز موعد
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    dir="rtl"
                >
                    {
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">

                            {/* Header */}
                            <div className="bg-blue-600 text-white p-4">
                                <h2 className="text-lg font-bold">حجز موعد جديد</h2>
                                <p className="text-sm text-blue-100">
                                    الرجاء تعبئة البيانات التالية
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">

                                <input
                                    name="patientName"
                                    placeholder="الاسم الكامل"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl p-3 border border-gray-300 bg-white text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    required
                                />

                                <input
                                    name="patientAddress"
                                    placeholder="العنوان"
                                    value={formData.patientAddress}
                                    onChange={handleChange}
                                    className="w-full rounded-xl p-3 border border-gray-300 bg-white text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    required
                                />

                                <input
                                    name="patientPhoneNumber"
                                    placeholder="رقم الجوال"
                                    value={formData.patientPhoneNumber}
                                    onChange={handleChange}
                                    className="w-full rounded-xl p-3 border border-gray-300 bg-white text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    required
                                />

                                {/* Date & Time Selector */}
                                <TimeSelector onSelect={handleSelect} workingHours={selectedClinic.workingHours!} />


                                <textarea
                                    name="notes"
                                    placeholder="ملاحظات (اختياري)"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-xl p-3 border border-gray-300 bg-white text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                {
                                    err &&
                                    <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 mt-3 text-sm font-medium">
                                        {err.message}
                                    </p>
                                }

                                {/* Actions */}
                                <div className="flex justify-between items-center pt-2">

                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        إلغاء
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {loading ? <Spinner color="white" /> : "تأكيد الحجز"}
                                    </button>

                                </div>

                            </form>
                        </div>
                    }
                </div>
            )}
        </>
    );
}