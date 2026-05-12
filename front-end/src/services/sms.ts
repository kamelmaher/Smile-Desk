import { post } from "../config/api";

const baseUrl = "/sms"
export const sms = {
    sendOtp: (data: { sendTo: string, clinicId: string }) => post(`${baseUrl}/send-otp`, data),
    verifyOtp: (data: { phoneNumber: string, clinicId: string, otp: string }) => post(`${baseUrl}/verify-otp`, data),

    pickAppointment: (data: { clinicId: string, date: string, patientName: string }) => post(`${baseUrl}/pick-sms`, data),

    confirmAppointment: (data: { clinicId: string, date: string, patientName: string, patientPhoneNumber: string, status: "accepted" | "declined" }) => post(`${baseUrl}/confirm-sms`, data),
}