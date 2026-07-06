import { create } from "zustand";

export type appointmentFilters = {
    page?: number,
    dateRange?: string,
    status?: string
}

type appointmentState = {
    filters: appointmentFilters,
    setFilters: (filters: appointmentFilters) => void
}

export const useAppointmentStore = create<appointmentState>((set) => ({
    filters: { page: 1 },
    setFilters: (filters: appointmentFilters) => {
        set({ filters })
    }
}));
