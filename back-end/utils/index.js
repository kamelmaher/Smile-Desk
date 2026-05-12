const dayjs = require("dayjs")
require("dayjs/locale/ar");
dayjs.locale("ar");

const getOptMessage = (otp) => {
    return `رمز التحقق الخاص بك هو: ${otp}. صالح لمدة دقيقتين.`
}

const getPickApptMsg = (date, patientName) => {
    const name = patientName.split(" ")[0] || "-"
    const fullDate = dayjs(date).format('YYYY-MM-DD')
    return `تم حجز موعد باسم: ${name} بتاريخ: ${fullDate}. يرجى تأكيد الموعد.`
}

const getConfirmApptMsg = (date, status, patientName, clinicName) => {
    const fullDate = dayjs(date).format('YYYY-MM-DD')
    const response = status === "accepted" ? "تأكيد" : "الغاء"
    const name = patientName.split(" ")[0] || "-"
    return `مرحبا ${name}. لقد تم ${response} موعدكم في ${clinicName} بتاريخ: ${fullDate}.`
}

module.exports = {
    getOptMessage,
    getPickApptMsg,
    getConfirmApptMsg
}

