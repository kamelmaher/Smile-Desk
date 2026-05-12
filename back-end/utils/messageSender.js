const smsSender = require("../services/smsSender")

module.exports = async (appt, msgGenerator, sendTo) => {
    try {
        const msg = msgGenerator(appt)
        return msg
        // return await smsSender(msg, sendTo)
    } catch (err) {
        return "فشل ارسال الرسالة"
    }
}