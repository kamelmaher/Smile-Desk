import { create } from "zustand";
import { auth } from "../services/auth";
import type { registerType } from "../types/authTypes";
import type { User } from "../types/User";



type AuthState = {
    user: User | null;
    loading: boolean;
    authLoading: boolean
    isAuthenticated: boolean;
    err: string | null,
    register: (data: registerType) => Promise<{ success: boolean }>,
    login: (data: { email: string; password: string }) => Promise<{ success: boolean }>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    authLoading: false,
    isAuthenticated: false,
    err: null,

    fetchUser: async () => {
        set({ loading: true });

        try {
            const res = await auth.me();
            if (res.data.status == "success")
                set({
                    user: res.data.data,
                    isAuthenticated: true,
                    loading: false,
                });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                err: "Something went wrong"
            });
        }
        finally {
            set({ loading: false })
        }
    },

    register: async (data) => {
        set({ authLoading: true, err: null })
        try {
            const response = await auth.register(data)
            if (response.data.status === "success") {
                await useAuthStore.getState().fetchUser()
                return { success: true }
            } else {
                set({
                    err: "Something went wrong"
                })
                return { success: false }
            }
        } catch (err) {
            set({
                err: "Something went wrong"
            })
            return { success: false }
        } finally {
            set({
                authLoading: false,
            })
        }

    },

    login: async (data) => {
        set({ authLoading: true, err: null });
        try {
            const response = await auth.login(data);
            if (response.data.status === "success") {
                await useAuthStore.getState().fetchUser();
                return { success: true }
            }
            else {
                set({ err: response.data.data || "invalid credintials" })
                return { success: false }
            }
        } catch (err) {
            set({ err: "something went wrong" })
            return { success: false }
        } finally {
            set({ authLoading: false })
        }
    },

    logout: async () => {
        set({ loading: true })
        await auth.logout();

        set({
            user: null,
            isAuthenticated: false,
            loading: false
        });
    },

    updateUser: async (data) => {
        set({ loading: true })
        try {
            const res = await auth.updateUser(data)
            if (res.data.status === "success") {
                set({ user: res.data.data })
            }
        } catch (err) {
            set({ err: "Something went wrong" })
        } finally {
            set({ loading: false })
        }
    }
}));