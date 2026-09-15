const { z } = require("zod")

const registerSchema = z.object({
    userName: z.string({ error: "الاسم مطلوب" }).trim().min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
    email: z.string({ error: "البريد الإلكتروني مطلوب" }).trim().email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string({ error: "كلمة المرور مطلوبة" }).min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل"),
    clinicName: z.string({ error: "اسم العيادة مطلوب" }).trim().min(2, "اسم العيادة يجب أن يحتوي على حرفين على الأقل"),
    phoneNumber: z.string({ error: "رقم الهاتف مطلوب" }).trim().min(9, "رقم الهاتف يجب أن يحتوي على 9 أرقام على الأقل")
})

const loginSchema = z.object({
    email: z.string({ error: "البريد الإلكتروني مطلوب" }).trim().email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string({ error: "كلمة المرور مطلوبة" }).min(1, "كلمة المرور مطلوبة"),
})

const updateUserSchema = z.object({
    userName: z.string().trim().min(2).optional(),
    email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح").optional(),
    phoneNumber: z.string().trim().min(9, "رقم الهاتف يجب أن يحتوي على 9 أرقام على الأقل").optional(),
    password: z.string().min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل").optional(),
}).refine((data) => Object.keys(data).length > 0, "يجب إرسال حقل واحد على الأقل للتحديث")

module.exports = { registerSchema, loginSchema, updateUserSchema }