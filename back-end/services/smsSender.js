const statusText = require("../data/statusText")
const axios = require("axios")

// const apiLink = process.env.SMS_PROVIDER_LINK
// const apiKey = process.env.SMS_API_KEY
const apiLink = process.env.HI_FIVE_LINK

const smsSender = async (message, sendTo) => {

    // Check Phone Number
    const phoneRegex = /^(059|056)\d{7}$/;
    if (!sendTo || !phoneRegex.test(sendTo))
        return {
            status: statusText.ERROR,
            data: "رقم الهاتف غير صحيح"
        };

    // Check Message
    if (!message) return {
        status: statusText.ERROR,
        data: "يرجى اضافة رسالة"
    };
    if (!apiLink) return {
        status: statusText.ERROR,
        data: "SMS service is not configured"
    };
    try {
        const response = await axios.post(apiLink, null, {
            params: { to: sendTo, message },
            timeout: 10000,
        })
        return response.data
    } catch {
        return { status: statusText.ERROR, data: "حدث خطا ما" }
    }
}

module.exports = smsSender