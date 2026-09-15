import { useQuery } from "@tanstack/react-query"
import { statics } from "../services/statics"

const staticsKey = ["statics"]

export type DashboardStatics = {
    totalAppointments: number
    pendingAppointments: number
    acceptedAppointments: number
    declinedAppointments: number
    todayAppointments: number
    upcomingAppointments: number
}

type DashboardStaticsResponse = {
    status: string
    statics: DashboardStatics
}

export const useLoadStatics = (id?: string) => {
    return useQuery<DashboardStaticsResponse>({
        queryKey: [...staticsKey, id],
        queryFn: () => statics.dashboardStatics(id!).then(res => res.data),
        enabled: Boolean(id),
    })
}