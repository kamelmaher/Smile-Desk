import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true
});

apiClient.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error(err.response?.data || err.message);
        return Promise.reject(err);
    }
);

const { get, post, put, delete: destroy, patch } = apiClient;
export { get, post, put, destroy, patch };
export default apiClient;
