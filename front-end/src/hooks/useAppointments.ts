import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointment } from '../services/appointment'
import type { Appointment } from '../types/Appointment'
import type { appointmentFilters } from '../store/appointment.store'
import { showError, showSuccess } from '../utils/toast'

const APPOINTMENTS_KEY = ['appointments']

const getAppointmentError = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message !== "Request failed") return error.message
    const responseData = (error as { response?: { data?: { data?: string } } }).response?.data
    return responseData?.data || fallback
}

type getAppointmentResponse = {
    appointments: Appointment[],
    pages: number
}

export function useLoadAppointments(filters: appointmentFilters) {
    return useQuery<getAppointmentResponse>({
        queryKey: [...APPOINTMENTS_KEY, filters],
        queryFn: () => appointment.loadAppointments(filters).then(res => res.data),
    })
}

export function useCreateAppointment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (data: Appointment) => {
            try {
                const response = await appointment.create(data)
                if (response.data.status !== "success") {
                    throw new Error(response.data.data || "تعذر إنشاء الموعد")
                }
                return response.data
            } catch (error) {
                throw new Error(getAppointmentError(error, "تعذر إنشاء الموعد"), { cause: error })
            }
        },
        onSuccess: () => {
            showSuccess("تم انشاء الموعد بنجاح")
            qc.invalidateQueries({
                queryKey: APPOINTMENTS_KEY,
            })
        }
    })
}

export function useConfirmAppointment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            try {
                const response = await appointment.confirm(id)
                if (response.data.status !== "success") throw new Error(response.data.data || "تعذر تأكيد الموعد")
                return response.data
            } catch (error) {
                throw new Error(getAppointmentError(error, "تعذر تأكيد الموعد"), { cause: error })
            }
        },
        onSuccess: () => {
            showSuccess("تم التاكيد بنجاح")
            qc.invalidateQueries({
                queryKey: APPOINTMENTS_KEY,
            })
        },
        onError: (error) => showError(error.message),
    })
}

export function useDeclineAppointment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            try {
                const response = await appointment.decline(id)
                if (response.data.status !== "success") throw new Error(response.data.data || "تعذر إلغاء الموعد")
                return response.data
            } catch (error) {
                throw new Error(getAppointmentError(error, "تعذر إلغاء الموعد"), { cause: error })
            }
        },
        onSuccess: () => {
            showSuccess("تم الالغاء بنجاح")
            qc.invalidateQueries({
                queryKey: APPOINTMENTS_KEY,
            })
        },
        onError: (error) => showError(error.message),
    })
}

export function useGetBooked(date: string, clinicId: string) {
    return useQuery({
        queryKey: ['booked', clinicId, date],
        queryFn: () => appointment.getBooked(date, clinicId).then(res => res.data),
        enabled: Boolean(date && clinicId),
    })
}
