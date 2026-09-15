import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clinic } from "../services/clinic"
import type { Clinic, ClinicSubscription } from "../types/Clinic"
import { showError, showSuccess } from "../utils/toast"

const ClinicKey = ["clinic"]

type getClinicsResponse = {
    clinics: Clinic[],
    pages: number
}

export const useLoadClinics = (page: number = 1) => {
    return useQuery<getClinicsResponse>({
        queryKey: [...ClinicKey, page],
        queryFn: () => clinic.getClinics(page).then(res => res.data)
    })
}

export const useLoadClinic = () => {
    return useQuery({
        queryKey: [...ClinicKey, "userClinic"],
        queryFn: () => clinic.getUserClinic().then(res => res.data)
    })
}

export const useUpdateClinic = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<Clinic>) => clinic.updateClinic(data),
        onSuccess: () => {
            showSuccess("تم التعديل بنجاح")
            qc.invalidateQueries({
                queryKey: ClinicKey
            })
        },
        onError: (error) => {
            showError(error.message || "تعذر تحديث بيانات العيادة")
        }
    })
}

export const useSubscribe = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ clinicId, plan }: { clinicId: string, plan: ClinicSubscription["plan"] }) => {
            const response = await clinic.subscribe(clinicId, plan)
            if (response.data.status !== "success") {
                throw new Error(response.data.data || "تعذر تحديث الاشتراك")
            }
            return response.data
        },
        onSuccess: () => {
            showSuccess("تم تحديث الاشتراك بنجاح")
            qc.invalidateQueries({
                queryKey: ClinicKey
            })
        },
        onError: (error) => {
            showError(error.message)
        }
    })
}

export const useLoadAminClinics = () => {
    return useQuery<getClinicsResponse>({
        queryKey: ClinicKey,
        queryFn: () => clinic.getAllClinics().then(res => res.data)
    })
}

export const useLoadClinicBySlug = (slug: string) => {
    return useQuery({
        queryKey: [...ClinicKey, slug],
        queryFn: () => clinic.getClinicBySlug(slug).then(res => res.data)
    })
}