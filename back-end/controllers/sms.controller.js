const smsSender = require("../services/smsSender")
const bcrypt = require("bcryptjs")
const crypto = require("crypto");
const OTP = require("../models/OTP");
const dayjs = require("dayjs");
const statusText = require("../data/statusText")
const { getOptMessage, getPickApptMsg, getConfirmApptMsg } = require("../utils/index");
const { stat } = require("fs");
const User = require("../models/User");

const sendOtp = async (req, res) => {
    const { sendTo } = req.body

    const otp = crypto.randomInt(10000, 99999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10)
    try {
        await OTP.create({
            sendTo,
            hashedOtp,
            expiresAt: dayjs().add(2, "minute").toDate()
        })

        const message = getOptMessage(otp)
        await smsSender(message, sendTo)
        return res.json({ status: statusText.SUCCESS, data: "تم الارسال بنجاح" })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "حدث خطا في توليد رمز otp" })
    }
}

const verifyOtp = async (req, res) => {
    const { otp, phoneNumber } = req.body
    try {
        const otpData = await OTP.findOne({ sendTo: phoneNumber })
        if (!otpData) return res.json({ status: statusText.ERROR, data: "انتهت صلاحية الرمز! حاول مرة أخرى" })

        if (otpData.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpData._id });
            return res.json({
                status: statusText.ERROR,
                data: "انتهت صلاحية الرمز"
            });
        }

        const isMatched = await bcrypt.compare(otp, otpData.hashedOtp)
        if (!isMatched) {
            if (otpData.attempts > 3) {
                await OTP.deleteOne({ _id: otpData._id });
                return res.json({ status: statusText.ERROR, data: "تم تجاوز عدد المحاولات" })
            }

            otpData.attempts = (otpData.attempts || 0) + 1;
            await otpData.save();

            return res.json({
                status: statusText.ERROR,
                data: "رمز التأكيد غير صحيح"
            });
        }

        await OTP.deleteOne({ _id: otpData._id });
        return res.json({ status: statusText.SUCCESS, data: "تمت المصادقة بنجاح" })

    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "حدث خطا ما" })
    }
}

const appointmentPick = async (req, res) => {
    const { patientName, date } = req.body;
    try {
        const clinic = req.clinic
        if (!clinic) return res.json({ status: statusText.ERROR, data: "العيادة غير موجودة" })
        if (!patientName || !date) return res.json({ status: statusText.ERROR, data: "تاكد من صحة البيانات" })
        const message = getPickApptMsg(date, patientName)
        await smsSender(message, clinic.phoneNumber)
        return res.json({ status: statusText.SUCCESS })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "حدث خطا ما" })
    }
}

const appointmentConfirm = async (req, res) => {
    const { patientName, patientPhoneNumber, date, status } = req.body
    try {
        const clinic = req.clinic
        if (!clinic) return res.json({ status: statusText.ERROR, data: "العيادة غير موجودة" })

        if (!patientName || !date || !patientPhoneNumber || !status) return res.json({ status: statusText.ERROR, data: "تاكد من صحة البيانات" })

        const message = getConfirmApptMsg(date, status, patientName, clinic.clinicName)
        await smsSender(message, patientPhoneNumber)
        return res.json({ status: statusText.SUCCESS, data: "تم اعلام المريض بنجاح" })
    } catch (err) {
        return res.json({ status: statusText.ERROR, data: "حدث خطا ما" })
    }
}

module.exports = {
    sendOtp,
    verifyOtp,
    appointmentPick,
    appointmentConfirm
}