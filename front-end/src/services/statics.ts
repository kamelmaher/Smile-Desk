import { get } from "../config/api";
const baseUrl = "/statics"

export const statics = {
    dashboardStatics: (id: string) => get(`${baseUrl}/${id}`)
};