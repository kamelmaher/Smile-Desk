import { create } from "zustand"
import type { User } from "../types/User"
import { auth } from "../services/auth"

type UserState = {
    users: User[],
    getUsers: () => Promise<void>
    page: number,
    setPage: (page: number) => void
    loading: boolean
}
export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    loading: false,
    page: 1,
    setPage: (page) => set({ page }),
    getUsers: async () => {
        set({ loading: true })
        try {
            const res = await auth.getUsers(get().page)
            if (res.data.status === "success") set({ users: res.data.data })
        } finally {
            set({ loading: false })
        }
    }
}))