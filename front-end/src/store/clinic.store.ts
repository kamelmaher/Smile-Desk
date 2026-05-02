import { create } from "zustand/react";
import { clinic } from "../services/clinic";
import type { Clinic } from "../types/Clinic";
type clinicState = {
    loading: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    updateLoading: boolean,
    clinicLoading: boolean,
    err: string | null,
    clinics: Clinic[],
    selectedClinic: Clinic
    loadClinics: (page?: number) => Promise<void>
    getClinicBySlug: (slug: string) => Promise<void>
    getUserClinic: () => Promise<void>
}
export const useClinicStore = create<clinicState>((set, get) => ({
    loading: false,
    page: 1,
    totalPages: 0,
    setPage: (page) => set({ page }),
    updateLoading: false,
    clinicLoading: false,
    err: null,
    clinics: [],
    selectedClinic: {} as Clinic,
    loadClinics: async (page) => {
        set({ loading: true })
        try {
            const response = await clinic.getClinics(page || 1)
            if (response.data.status === "success") {
                set({
                    clinics: response.data.data,
                    totalPages: response.data.pages
                })
            } else set({ err: response.data.data })
        } catch (err) {
            set({ err: "something went wrong" })
        } finally {
            set({ loading: false })
        }
    },
    getClinicBySlug: async (slug) => {
        try {
            set({ clinicLoading: true })
            if (get().selectedClinic?.slug === slug) return;
            const response = await clinic.getClinicBySlug(slug)
            if (response.data.status == "success") {
                set({ selectedClinic: response.data.data })
            }
            else set({ err: "Failed Loading Clinic" })
        } catch (err) {
            set({ err: "Something Went Wrong" })
        } finally {
            set({ clinicLoading: false })
        }
    },
    getUserClinic: async () => {
        set({ loading: true })
        try {
            const res = await clinic.getUserClinic()
            if (res.data.status === "success") set({ selectedClinic: res.data.data })
            else set({ err: res.data.data })
        } catch (err) {
            set({ err: "Something went wrong" })
        } finally {
            set({ loading: false })
        }
    },
}))