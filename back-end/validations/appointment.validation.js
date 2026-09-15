const { z } = require("zod")

const appointmentSchema = z.object({
    clinicId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid clinic id"),
    date: z.string().min(1, "Date is required").refine((value) => {
        const parsedDate = new Date(value)
        return !Number.isNaN(parsedDate.getTime())
    }, "Invalid date"),

    notes: z.string().optional(),

    patientName: z.string().trim().min(2, "Name is required"),

    patientPhoneNumber: z
        .string()
        .trim().min(8, "Phone number is too short"),

    patientEmail: z.string().email().optional().or(z.literal("")),

    patientAddress: z.string().trim().min(2, "Address is required"),
});



module.exports = { appointmentSchema }