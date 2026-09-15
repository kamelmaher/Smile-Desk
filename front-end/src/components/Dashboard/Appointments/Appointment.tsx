import type { Appointment as AppointmentType } from "../../../types/Appointment"
import { checkExpired, getFullDate } from "../../../utils/appointments"

import AppointmentOptions from "./AppointmentOptions"

type AppointmentProps = {
    appointment: AppointmentType
}
const Appointment = ({ appointment }: AppointmentProps) => {
    const { _id, patientName, patientAddress, patientPhoneNumber, status, date, notes, patientEmail } = appointment
    const appointmentDate = getFullDate(date)
    const isExpired = checkExpired(date)
    return (
        <div
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="mb-2">
                <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900 mb-2">{patientName}</h3>
                    {
                        isExpired &&
                        <p className="bg-red-700 text-white p-[5px] rounded-2xl text-sm">
                            منتهي - {status === "accepted" ? "تم التأكيد" : status === "declined" ? "ملغى" : "بانتظار التأكيد"}
                        </p>
                    }
                </div>
                <div className="flex gap-2 text-gray-500 text-sm">
                    <p> {appointmentDate}</p>
                </div>
                <div className="text-[14px] mt-2">
                    <p className="text-blue-600 font-bold">بيانات المريض</p>
                    {patientAddress && <p>العنوان: {patientAddress}</p>}
                    {patientPhoneNumber && <p>رقم الهاتف: {patientPhoneNumber}</p>}
                    {patientEmail && <p>الايميل: {patientEmail}</p>}
                </div>
            </div>

            {/* Options */}
            {_id && <AppointmentOptions _id={_id} isExpired={isExpired} status={status} />}

            {notes && <div>الملاحظات: {notes}</div>}
        </div>
    )
}

export default Appointment;
