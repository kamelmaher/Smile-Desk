import { create } from "zustand";
import { auth } from "../services/auth";
import type { registerType } from "../types/authTypes";
import type { User } from "../types/User";
import { showError, showSuccess } from "../utils/toast";



type AuthState = {
    user: User | null;
    loading: boolean;
    authLoading: boolean
    authChecked: boolean
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
    authChecked: false,
    isAuthenticated: false,
    err: null,

    fetchUser: async () => {
        set({ loading: true });

        try {
            const res = await auth.me();
            if (res.data.status === "success") {
                set({
                    user: res.data.data,
                    isAuthenticated: true,
                    err: null,
                });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                err: null
            });
        }
        finally {
            set({ loading: false, authChecked: true })
        }
    },

    register: async (data) => {
        set({ authLoading: true, err: null })
        try {
            const response = await auth.register(data)
            if (response.data.status === "success") {
                await useAuthStore.getState().fetchUser()
                if (!useAuthStore.getState().isAuthenticated) return { success: false }
                showSuccess("تم التسجيل بنجاح")
                return { success: true }
            } else {
                const message = typeof response.data.data === "string"
                    ? response.data.data
                    : "حدث خطأ أثناء إنشاء الحساب"
                set({
                    err: message
                })
                showError(message)
                return { success: false }
            }
        } catch (err) {
            const message = getErrorMessage(err, "حدث خطأ أثناء إنشاء الحساب")
            set({ err: message })
            showError(message)
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
                if (!useAuthStore.getState().isAuthenticated) return { success: false }
                showSuccess("تم تسجيل الدخول بنجاح")
                return { success: true }
            }
            else {
                set({ err: response.data.data || "invalid credintials" })
                showError(response.data.data)
                return { success: false }
            }
        } catch (err) {
            const message = getErrorMessage(err, "حصل خطأ ما")
            set({ err: message })
            showError(message)
            return { success: false }
        } finally {
            set({ authLoading: false })
        }
    },

    logout: async () => {
        set({ loading: true })
        try {
            const res = await auth.logout();
            if (res.data.status !== "success") {
                throw new Error(getErrorMessage(res.data.data, "تعذر تسجيل الخروج"))
            }
            showSuccess("تم تسجيل الخروج بنجاح")
        } catch (err) {
            showError(getErrorMessage(err, "تعذر تسجيل الخروج"))
        } finally {
            set({ user: null, isAuthenticated: false, loading: false, authChecked: true })
        }
    },

    updateUser: async (data) => {
        set({ loading: true })
        try {
            const res = await auth.updateUser(data)
            if (res.data.status === "success") {
                set({ user: res.data.data })
                showSuccess("تم التحديث بنجاح")
            } else {
                const message = getErrorMessage(res.data.data, "تعذر تحديث البيانات")
                set({ err: message })
                showError(message)
            }
        } catch (err) {
            const message = getErrorMessage(err, "حصل خطأ ما")
            set({ err: message })
            showError(message)
        } finally {
            set({ loading: false })
        }
    }
}));

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response
        if (typeof response === "object" && response !== null && "data" in response) {
            const data = response.data
            if (typeof data === "object" && data !== null && "data" in data && typeof data.data === "string") {
                return data.data
            }
        }
    }
    return fallback
}