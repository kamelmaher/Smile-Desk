import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointment } from '../services/appointment'
import type { Appointment } from '../types/Appointment'
import type { appointmentFilters } from '../store/appointment.store'
import { showSuccess } from '../utils/toast'

const APPOINTMENTS_KEY = ['appointments']

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
        mutationFn: (data: Appointment) => appointment.create(data).then(res => res.data),
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
        mutationFn: (id: string) => appointment.confirm(id).then(res => res.data),
        onSuccess: () => {
            showSuccess("تم التاكيد بنجاح")
            qc.invalidateQueries({
                queryKey: APPOINTMENTS_KEY,
            })
        }
    })
}

export function useDeclineAppointment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => appointment.decline(id).then(res => res.data),
        onSuccess: () => {
            showSuccess("تم الالغاء بنجاح")
            qc.invalidateQueries({
                queryKey: APPOINTMENTS_KEY,
            })
        }
    })
}

export function useGetBooked(date: string) {
    return useQuery({
        queryKey: ['booked', date],
        queryFn: () => appointment.getBooked(date).then(res => res.data),
        enabled: !!date,
    })
}
