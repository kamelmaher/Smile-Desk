import { post, get, patch } from "../config/api";
import type { appointmentFilters } from "../store/appointment.store";
import type { Appointment } from "../types/Appointment";

const baseUrl = "/appointment"
export const appointment = {
    create: (data: Appointment) => post(baseUrl, data),
    loadAppointments: async (filters: appointmentFilters) => get(baseUrl, { params: filters }),
    confirm: (id: string) => patch(`${baseUrl}/confirm/${id}`),
    decline: (id: string) => patch(`${baseUrl}/decline/${id}`),
    getBooked: (date: string) => get(`${baseUrl}/booked?date=${date}`),
    checkPhoneNumber: (phoneNumber: string, clinicId: string) => post(`${baseUrl}/check-number?number=${phoneNumber}`, { clinicId })
};
