import { get, post } from "../config/api"
import type { createInvoiceType, invoiceQueryFilters } from "../store/invoice.store"

const baseUrl = "/invoice"
export const invoice = {
    getInvoices: (params: invoiceQueryFilters) => get(baseUrl, { params }),
    getOverview: () => get(`${baseUrl}/overview`),
    createInvoice: (data: createInvoiceType) => post(baseUrl, data)
}