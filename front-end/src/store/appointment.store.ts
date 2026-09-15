import { create } from "zustand";

export type appointmentFilters = {
    page?: number,
    dateRange?: "" | "today" | "upcoming" | "expired",
    status?: "" | "pending" | "accepted" | "declined"
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
