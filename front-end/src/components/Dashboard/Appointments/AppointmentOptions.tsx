/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { appointmentStatus } from "../../../data/constants"
import Spinner from "../../Spinner"
import { useConfirmAppointment, useDeclineAppointment } from "../../../hooks/useAppointments"
type AppointmentOptionsProps = {
    _id: string,
    isExpired: boolean
    status: "accepted" | "declined" | "pending"
}
const AppointmentOptions = ({ _id, isExpired, status }: AppointmentOptionsProps) => {
    const confirmMutation = useConfirmAppointment()
    const declineMutation = useDeclineAppointment()
    const [loading, setLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    
    const handleConfirm = async () => {
        setLoading(true)
        try {
            await confirmMutation.mutateAsync(_id)
        } catch (e) {
            // handled by query error handling
        } finally {
            setLoading(false)
            setIsUpdating(false)
        }
    }

    const handleDecline = async () => {
        setLoading(true)
        try {
            await declineMutation.mutateAsync(_id)
        } catch (e) {
            // handled by query error handling
        } finally {
            setLoading(false)
            setIsUpdating(false)
        }
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
