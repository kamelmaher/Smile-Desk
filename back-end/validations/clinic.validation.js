const { z } = require("zod")
const plans = require("../data/plans")

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

const workingHourSchema = z.object({
    day: z.number().int().min(0).max(6),
    isOpen: z.boolean(),
    start: z.string().regex(timePattern, "Invalid start time").optional(),
    end: z.string().regex(timePattern, "Invalid end time").optional(),
}).superRefine((workingHour, context) => {
    if (workingHour.isOpen && (!workingHour.start || !workingHour.end)) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Open days require start and end times",
            path: ["start"],
        })
    }

    if (workingHour.start && workingHour.end && workingHour.start >= workingHour.end) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End time must be after start time",
            path: ["end"],
        })
    }
})

const updateClinicSchema = z.object({
    clinicName: z.string().trim().min(2).optional(),
    email: z.string().trim().email().optional().or(z.literal("")),
    phoneNumber: z.string().trim().min(9).optional(),
    description: z.string().trim().optional(),
    logo: z.string().trim().url().optional().or(z.literal("")),
    address: z.string().trim().optional(),
    workingHours: z.array(workingHourSchema).length(7).optional(),
}).refine((data) => Object.keys(data).length > 0, "At least one clinic field is required")

const subscribeSchema = z.object({
    clinicId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid clinic id"),
    plan: z.enum([plans.MONTHLY, plans.ANNUAL, plans.LIFETIME]),
})

module.exports = {
    updateClinicSchema,
    subscribeSchema,
}
