import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let isRedirectingToPricing = false;

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (
            error.response?.status === 402 &&
            window.location.pathname !== "/pricing" &&
            !isRedirectingToPricing
        ) {
            isRedirectingToPricing = true;
            window.location.assign("/pricing?subscription=expired");
        }

        return Promise.reject(error);
    }
);


export const { get, post, patch, put, delete: destroy } = apiClient
export default apiClient;