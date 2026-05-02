import { useState } from "react"
import { appointmentStatus } from "../../../data/constants"
import { useAppointmentStore } from "../../../store/appointment.store"
import Spinner from "../../Spinner"
type AppointmentOptionsProps = {
    _id: string,
    isExpired: boolean
    status: "accepted" | "declined" | "pending"
}
const AppointmentOptions = ({ _id, isExpired, status }: AppointmentOptionsProps) => {
    const { confirmAppointment, declineAppointment } = useAppointmentStore()
    const [loading, setLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const handleConfirm = async () => {
        setLoading(true)
        await confirmAppointment(_id!)
        setLoading(false)
        setIsUpdating(false)
    }

    const handleDecline = async () => {
        setLoading(true)
        await declineAppointment(_id!)
        setLoading(false)
        setIsUpdating(false)
    }

    return (
        !isExpired &&
        <div className="flex gap-3 items-center text-sm">
            {
                loading ? <Spinner /> :
                    (status == appointmentStatus.pending || isUpdating) ?
                        <>
                            <button
                                className="text-yellow-600 hover:underline"
                                onClick={handleConfirm}
                            >
                                تأكيد
                            </button>
                            <button
                                className="text-red-600 hover:underline"
                                onClick={handleDecline}
                            >
                                الغاء
                            </button>
                        </>
                        :
                        <div className="flex gap-2">
                            {
                                status == appointmentStatus.accepted ?
                                    <p className="text-green-500">تم التأكيد</p>
                                    :
                                    <p className="text-red-500">تم الالغاء</p>
                            }
                            <button onClick={() => setIsUpdating(true)}>تعديل</button>
                        </div>
            }
        </div>
    )
}

export default AppointmentOptions
