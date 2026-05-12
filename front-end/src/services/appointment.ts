import { post, get, patch } from "../config/api";
import type { Appointment } from "../types/Appointment";

const baseUrl = "/appointment"
export const appointment = {
    create: (data: Appointment) => post(baseUrl, data),
    // getById: (id: string) => get(`/appointment/${id}`),
    loadAppointments: async (page: number) => get(`${baseUrl}?page=${page}`),
    getTodayAppointments: () => get(`${baseUrl}/today`),
    getUpComingAppointments: () => get(`${baseUrl}/upcoming`),
    getExpiredAppointments: (page: number) => get(`${baseUrl}/expired?page=${page || 1}`),
    confirm: (id: string) => patch(`${baseUrl}/confirm/${id}`),
    decline: (id: string) => patch(`${baseUrl}/decline/${id}`),
    search: (term: string) => get(`${baseUrl}/search?term=${term}`),
    getBooked: (date: string) => get(`${baseUrl}/booked?date=${date}`),
    updateAppointment: (data: Partial<Appointment>) => patch(`${baseUrl}`, data),
    checkPhoneNumber: (phoneNumber: string, clinicId: string) => post(`${baseUrl}/check-number?number=${phoneNumber}`, { clinicId })
};
