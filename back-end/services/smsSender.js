const statusText = require("../data/statusText")
const dayjs = require("dayjs")
const plans = require("../data/plans")
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
    try {
        const date = dayjs().format("YYYY-MM-DD");
        const time = dayjs().format("HH:mm");
        // const response = await axios.post(
        //     apiLink,
        //     {
        //         api_key: apiKey,
        //         sender: "Smile Desk",
        //         message,
        //         to: sendTo,
        //         groups: "",
        //         date,
        //         time
        //     },
        //     {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     }
        // );
        const link = `${apiLink}&to=${sendTo}&message=${message}`
        const response = await axios.post(link)
        return response.data
    } catch (err) {
        console.log(err)
        return { status: statusText.ERROR, data: "حدث خطا ما" }
    }
}

module.exports = smsSender