import { useQuery } from "@tanstack/react-query"
import { statics } from "../services/statics"

const staticsKey = ["statics"]
export const useLoadStatics = (id: string) => {
    return useQuery({
        queryKey: [...staticsKey, id],
        queryFn: () => statics.dashboardStatics(id).then(res => res.data)
    })
}