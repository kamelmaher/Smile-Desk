/* eslint-disable @typescript-eslint/no-explicit-any */
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
    createInvoice: (data: createInvoiceType) => Promise<void>
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
            set({ invoices: res.data })
        } catch (err: any) {
            set({ err: err.response.data.message })
        } finally {
            set({ loading: false })
        }
    },
    getOverview: async () => {
        set({ loading: true, err: null })
        try {
            const res = await invoice.getOverview()
            set({ overview: res.data })
        } catch (err: any) {
            set({ err: err.response.data.message })
        } finally {
            set({ loading: false })
        }
    },
    createInvoice: async (data) => {
        set({ loading: true, err: null })
        try {
            const res = await invoice.createInvoice(data)
            set({ invoices: [res.data, ...get().invoices] })
            get().getOverview()
        } catch (err: any) {
            set({ err: err.response.data.message })
        } finally {
            set({ loading: false })
        }
    }
}))