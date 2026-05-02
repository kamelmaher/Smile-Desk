import { create } from "zustand";
import { appointment } from "../services/appointment";
import type { Appointment } from "../types/Appointment";

type appointmentState = {
    appointments: Appointment[]
    loading: boolean,
    optionsLoading: boolean,
    err: string | null
    todayAppointments: Appointment[],
    upComingAppointments: Appointment[],
    expiredAppointments: Appointment[],
    searchResults: Appointment[],
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    createAppointment: (data: Appointment) => Promise<void>
    loadAppointments: (page: number) => Promise<void>,
    getTodayAppointments: () => Promise<void>
    getUpcomingAppointments: () => Promise<void>
    getExpiredAppointments: (page: number) => Promise<void>
    confirmAppointment: (id: string) => Promise<void>
    declineAppointment: (id: string) => Promise<void>
    search: (term: string) => Promise<void>
    getBooked: (date: string) => Promise<number[]>,
    updateAppointment: (data: Partial<Appointment>) => Promise<void>
}
export const useAppointmentStore = create<appointmentState>((set, get) => ({
    loading: false,
    optionsLoading: false,
    err: null,
    appointments: [],
    todayAppointments: [],
    upComingAppointments: [],
    expiredAppointments: [],
    searchResults: [],
    page: 1,
    totalPages: 0,
    setPage: (page) => set({ page }),
    createAppointment: async (data) => {
        set({ loading: true, err: null })
        try {
            const response = await appointment.create(data)
            if (response.data.status === "success")
                set({ appointments: [...get().appointments, response.data.data] })
            else set({ err: "error while creating appointment" })
        } catch (err) {
            set({ err: "something went wrong" })
        } finally {
            set({ loading: false })
        }
    },
    loadAppointments: async (page) => {
        try {
            set({ loading: true })
            const res = await appointment.loadAppointments(page)
            if (res.data.status == "success")
                set({ appointments: res.data.data, totalPages: res.data.pages })
            else set({ err: res.data.data })
        } catch (err) {
            set({ err: "Something went Wrong" })
        } finally {
            set({ loading: false })
        }
    },
    getTodayAppointments: async () => {
        const res = await appointment.getTodayAppointments()
        if (res.data.status === "success")
            set({ todayAppointments: res.data.data })
        else set({ err: res.data.data })
    },
    getUpcomingAppointments: async () => {
        set({ loading: true })
        try {
            const res = await appointment.getUpComingAppointments()
            if (res.data.status === "success")
                set({ upComingAppointments: res.data.data })
            else set({ err: res.data.data })
        } catch (err) {
            set({ err: "Something Went Wrong" })
        } finally {
            set({ loading: false })
        }
    },
    getExpiredAppointments: async (page) => {
        try {
            set({ loading: true })
            const res = await appointment.getExpiredAppointments(page)
            if (res.data.status == "success")
                set({ expiredAppointments: res.data.data })
            else set({ err: res.data.data })
        } catch (err) {
            set({ err: "Something went Wrong" })
        } finally {
            set({ loading: false })
        }
    },
    confirmAppointment: async (id) => {
        if (!id) return
        set({ optionsLoading: true })
        try {
            const res = await appointment.confirm(id)
            if (res.data.status === "success") {
                set((state) => ({
                    appointments: state.appointments.map((appt) =>
                        appt._id === id
                            ? { ...appt, status: "accepted" }
                            : appt
                    ),
                }));
            }
            else
                set({ err: "Failed to confirm Appointment" })
        } catch (err) {
            set({ err: "Something went wrong" })
        } finally {
            set({ optionsLoading: false })
        }
    },
    declineAppointment: async (id) => {
        if (!id) return
        set({ optionsLoading: true })
        try {
            const res = await appointment.decline(id)
            if (res.data.status === "success") {
                set((state) => ({
                    appointments: state.appointments.map((appt) =>
                        appt._id === id
                            ? { ...appt, status: "declined" }
                            : appt
                    ),
                }));
            }
            else set({ err: "Failed to decline Appointment" })
        } catch (err) {
            set({ err: "Something went wrong" })
        } finally {
            set({ optionsLoading: false })
        }
    },
    search: async (term) => {
        set({ loading: true })
        try {
            const res = await appointment.search(term)
            if (res.data.status === "success") set({ searchResults: res.data.data })
        } catch (err) {
            set({ err: "Something went wrong" })
        } finally {
            set({ loading: false })
        }
    },
    getBooked: async (date: string) => {
        const res = await appointment.getBooked(date)
        if (res.data.status === "success")
            return res.data.data
        else return []
    },
    updateAppointment: async (data) => {
        try {
            const res = await appointment.updateAppointment(data)
            if (res.data.status == "success") {
                set((state) => ({
                    appointments: state.appointments.map((appt) =>
                        appt._id === data._id
                            ? { ...appt, ...data }
                            : appt
                    ),
                }));
            }
        } catch (err) {
            set({ err: "Error" })
        } finally {
            set({ loading: false })
        }
    }
}));
