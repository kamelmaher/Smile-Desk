/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { auth } from "../services/auth";
import type { registerType } from "../types/authTypes";
import type { User } from "../types/User";
import { showError, showSuccess } from "../utils/toast";



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
                showSuccess("تم التسجيل بنجاح")
                return { success: true }
            } else {
                set({
                    err: response.data.data
                })
                showError(response.data.data)
                return { success: false }
            }
        } catch (err) {
            set({
                err: "Something went wrong"
            })
            showError("حدث خطا أثناء انشاء الحساب")
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
                showSuccess("تم تسجيل الدخول بنجاح")
                return { success: true }
            }
            else {
                set({ err: response.data.data || "invalid credintials" })
                showError(response.data.data)
                return { success: false }
            }
        } catch (err) {
            set({ err: "حصل خطا ما" })
            showError("حصل خطا ما")
            return { success: false }
        } finally {
            set({ authLoading: false })
        }
    },

    logout: async () => {
        set({ loading: true })
        const res = await auth.logout();
        if (res.data.status === "success") {
            set({
                user: null,
                isAuthenticated: false,
                loading: false
            });
            showSuccess("تم تسجيل الخروج بنجاح")
        } else {
            set({ err: res.data as string })
            showError(res.data as string)
        }
    },

    updateUser: async (data) => {
        set({ loading: true })
        try {
            const res = await auth.updateUser(data)
            if (res.data.status === "success") {
                set({ user: res.data })
                showSuccess("تم التحديث بنجاح")
            } else {
                set({ err: res.data })
                showError(res.data)
            }
        } catch (err) {
            set({ err: "حصل خطا ما" })
            showSuccess("حصل خطا ما")
        } finally {
            set({ loading: false })
        }
    }
}));