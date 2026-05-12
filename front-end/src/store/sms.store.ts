/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { sms } from "../services/sms";
type SmsResponse = {
    status: "success" | "error",
    data: string
}

type SmsState = {
    smsLoading: boolean
    sendOtp: (data: { sendTo: string, clinicId: string }) => Promise<SmsResponse>,
    verifyOtp: (data: { phoneNumber: string, otp: string, clinicId: string }) => Promise<SmsResponse>
}
export const useSmsStore = create<SmsState>((set) => ({
    smsLoading: false,

    sendOtp: async (data) => {
        set({ smsLoading: true })
        try {
            const res = await sms.sendOtp(data)
            if (res.data.status == "success") {
                return { status: "success", data: "تم ارسال الرمز" }
            } else return { status: "error", data: res.data.data }
        } catch (err) {
            return { status: "error", data: "حدث خطا ما" }
        } finally {
            set({ smsLoading: false })
        }
    },
    verifyOtp: async (data) => {
        set({ smsLoading: true })
        try {
            const res = await sms.verifyOtp(data)
            if (res.data.status === "success")
                return { status: "success", data: res.data.data }
            else return { status: "error", data: res.data.data }
        } catch (err) {
            return { status: "error", data: "حدث خطا ما" }
        } finally {
            set({ smsLoading: false })
        }
    }
}))