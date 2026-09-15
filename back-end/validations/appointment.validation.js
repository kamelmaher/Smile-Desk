const { z } = require("zod")

const appointmentSchema = z.object({
    date: z.string().min(1, "Date is required").refine((value) => {
        const parsedDate = new Date(value)
        return !Number.isNaN(parsedDate.getTime())
    }, "Invalid date"),

    notes: z.string().optional(),

    patientName: z.string().min(2, "Name is required"),

    patientPhoneNumber: z
        .string()
        .min(8, "Phone number is too short"),

    patientEmail: z.string().email().optional().or(z.literal("")),

    patientAddress: z.string().min(2, "Address is required"),
});



module.exports = { appointmentSchema }