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
    const loading = confirmMutation.isPending || declineMutation.isPending

    const handleConfirm = async () => {
        try {
            await confirmMutation.mutateAsync(_id)
        } catch { /* Error is shown by the mutation hook. */ }
    }

    const handleDecline = async () => {
        try {
            await declineMutation.mutateAsync(_id)
        } catch { /* Error is shown by the mutation hook. */ }
    }

    return (
        !isExpired &&
        <div className="flex gap-3 items-center text-sm">
            {
                loading ? <Spinner /> :
                    status == appointmentStatus.pending ?
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
                        </div>
            }
        </div>
    )
}

export default AppointmentOptions
