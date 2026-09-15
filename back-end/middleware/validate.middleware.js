const statusText = require("../data/statusText")

const fieldNames = {
    userName: "الاسم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    clinicName: "اسم العيادة",
    phoneNumber: "رقم الهاتف",
    date: "التاريخ",
    patientName: "اسم المريض",
    patientPhoneNumber: "رقم هاتف المريض",
    patientEmail: "بريد المريض الإلكتروني",
    patientAddress: "عنوان المريض",
    notes: "الملاحظات",
}

module.exports = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (result.success) {
            req.body = result.data
            next()
        } else {
            const messages = result.error.issues.map((issue) => {
                const field = fieldNames[issue.path[0]] || "البيانات"
                return `${field}: ${issue.message}`
            })

            return res.status(400).json({
                status: statusText.ERROR,
                data: messages.join("\n"),
            })
        }
    }
}