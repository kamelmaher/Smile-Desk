/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { statics } from "../services/statics";

type statics = {
    totalAppointments: number,
    pendingAppointments: number,
    declinedAppointments: number
}
type staticsState = {
    statics: statics | null,
    loading: boolean,
    err: string | null
    getStatics: (id: string) => Promise<void>
}
export const useStatics = create<staticsState>((set) => ({
    loading: false,
    err: null,
    statics: null,
    getStatics: async (id: string) => {
        set({ loading: true })
        try {
            const res = await statics.dashboardStatics(id)
            console.log(res.data.data)
            if (res.status === 200)
                set({ statics: res.data.data })
        } catch (err: any) {
            set({ err: err.response.data.data.msg })
        } finally {
            set({ loading: false })
        }
    }
}))