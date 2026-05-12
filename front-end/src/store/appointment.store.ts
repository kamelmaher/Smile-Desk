/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { appointment } from "../services/appointment";
import type { Appointment } from "../types/Appointment";
import { showError, showSuccess } from "../utils/toast";
import { sms } from "../services/sms";

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
    getBooked: (date: string) => Promise<string[]>,
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
            if (response.data.status === "success") {
                set({ appointments: [...get().appointments, response.data.data] })
                showSuccess("تم انشاء الموعد بنجاح")
                sms.pickAppointment({ clinicId: data.clinicId, date: data.date, patientName: data.patientName })
            }
            else {
                set({ err: "error while creating appointment" })
                showError(response.data.data)
            }
        } catch (err) {
            set({ err: "something went wrong" })
            showError("حدث خطا ما")
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
        try {
            const res = await appointment.getTodayAppointments()
            if (res.data.status === "success")
                set({ todayAppointments: res.data.data })
            else set({ err: res.data.data })
        } catch (err) {
            showError("حدث خطا في تحميل مواعيد اليوم")
        }
    },

    getUpcomingAppointments: async () => {
        set({ loading: true })
        try {
            const res = await appointment.getUpComingAppointments()
            if (res.data.status === "success")
                set({ upComingAppointments: res.data.data })
            else set({ err: res.data.data })
        } catch (err) {
            showError("حدث خطا في تحميل المواعيد القادمة")
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
        } catch (err) {
            showError("حدث خطا في تحميل المواعيد المنتهية")
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

                showSuccess("تم التاكيد بنجاح")
                const appointment = get().appointments.find(e => e._id == id)!
                if (!appointment) return
                sms.confirmAppointment({ clinicId: appointment.clinicId, patientName: appointment.patientName, date: appointment.date, status: "accepted", patientPhoneNumber: appointment.patientPhoneNumber })
            }
            else {
                showError(res.data.data)
            }
        } catch (err) {
            showError("فشل التأكيد! يرجى المحاولة لاحقا.")
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
                showSuccess("تم الالغاء بنجاح")
                const appointment = get().appointments.find(e => e._id == id)!
                if (!appointment) return
                sms.confirmAppointment({ clinicId: appointment.clinicId, patientName: appointment.patientName, date: appointment.date, status: "declined", patientPhoneNumber: appointment.patientPhoneNumber })
            }
            else showError(res.data.data)
        } catch (err) {
            showError("فشل الالغاء! حاول مرة أخرى لاحقا ")
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
    }
}));
