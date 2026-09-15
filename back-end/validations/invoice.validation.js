const { z } = require("zod")

const invoiceFields = {
    amount: z.coerce.number().finite().gt(0, "Amount must be greater than zero"),
    type: z.enum(["income", "outcome"]),
    details: z.string().trim().min(1, "Details are required").max(500),
}

const createInvoiceSchema = z.object(invoiceFields)
const updateInvoiceSchema = createInvoiceSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    "At least one invoice field is required"
)

module.exports = {
    createInvoiceSchema,
    updateInvoiceSchema,
}
