import { create } from "zustand";
import { invoice } from "../services/invoice";
type Invoice = {
    _id: string,
    clinicId: string,
    amount: number,
    details: string,
    type: "income" | "outcome",
    createdAt: string
}

type overview = {
    totalInvoices: number,
    totalIncome: number,
    totalOutcome: number,
    balance: number
}

type invoiceState = {
    invoices: Invoice[],
    overview: overview | null,
    loading: boolean;
    err: string | null,
    getInvoices: ({ type, minAmount, maxAmount }: invoiceQueryFilters) => Promise<void>,
    getOverview: () => Promise<void>,
    createInvoice: (data: createInvoiceType) => Promise<boolean>
}

export type invoiceQueryFilters = {
    type?: "income" | "outcome" | "",
    minAmount?: number | null,
    maxAmount?: number | null,
}

export type createInvoiceType = {
    details: string,
    type: "income" | "outcome",
    amount: number,
}

export const useInovicesStore = create<invoiceState>((set, get) => ({
    loading: false,
    err: null,
    invoices: [],
    overview: null,
    getInvoices: async ({ type, minAmount, maxAmount }) => {
        set({ loading: true, err: null })
        try {
            const res = await invoice.getInvoices({ type, minAmount, maxAmount })
            set({ invoices: res.data.invoices })
        } catch (err: unknown) {
            set({ err: getInvoiceError(err, "Unable to load invoices") })
        } finally {
            set({ loading: false })
        }
    },
    getOverview: async () => {
        set({ loading: true, err: null })
        try {
            const res = await invoice.getOverview()
            set({ overview: res.data.overview })
        } catch (err: unknown) {
            set({ err: getInvoiceError(err, "Unable to load invoice overview") })
        } finally {
            set({ loading: false })
        }
    },
    createInvoice: async (data) => {
        set({ loading: true, err: null })
        try {
            const res = await invoice.createInvoice(data)
            set({ invoices: [res.data.data, ...get().invoices] })
            await get().getOverview()
            return true
        } catch (err: unknown) {
            set({ err: getInvoiceError(err, "Unable to create invoice") })
            return false
        } finally {
            set({ loading: false })
        }
    }
}))

const getInvoiceError = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message !== "Request failed") return error.message
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