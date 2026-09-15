const User = require("../models/User")
const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText")
const bcrypt = require("bcryptjs")
const roles = require("../data/roles")
const plans = require("../data/plans")
const jwtGenerator = require("../utils/jwtGenerator")
const getSlug = require("../utils/geSlug")
const { MAIN_LIMIT, TRIAL_DAYS } = require("../data/constants")

const cookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
};

const setCookies = (res, token) => {
    res.cookie("token", token, cookieOptions());
};

const login = async (req, res) => {
    const { password } = req.body
    const email = req.body.email.trim().toLowerCase()
    try {
        // Check Empty Feilds
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ status: statusText.FAIL, data: "check Email or Password" })

        // compare Passwords
        const hashedPassword = user.password
        const isMatched = await bcrypt.compare(password, hashedPassword)
        if (!isMatched) return res.status(401).json({ status: statusText.FAIL, data: "check Email or Password" })

        // generate token
        const token = await jwtGenerator({ _id: user._id, clinicId: user.clinicId, role: user.role })
        setCookies(res, token)

        return res.json({ status: statusText.SUCCESS, data: "User Logged in successfully" })
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Something went wrong" })
    }
}

const register = async (req, res) => {
    const { password, userName, clinicName, phoneNumber, description } = req.body
    const email = req.body.email.toLowerCase()
    const session = await User.startSession()
    try {
        // check if email not in use
        const emailFound = await User.findOne({ email })
        if (emailFound)
            return res.status(409).json({ status: statusText.FAIL, data: "user already exists" })

        // Check Clinic Name 
        const clinicNameFound = await Clinic.findOne({ clinicName })
        if (clinicNameFound)
            return res.status(409).json({ status: statusText.FAIL, data: "cannot use this clinic name" })

        // Check Phone Number
        const phoneNumberFound = await User.findOne({ phoneNumber })
        if (phoneNumberFound)
            return res.status(409).json({ status: statusText.FAIL, data: "رقم الهاتف مستخدم من قبل" })

        // password hash 
        const hashedPass = await bcrypt.hash(password, 10)

        // create user
        let newUser;
        let clinic;
        await session.withTransaction(async () => {
            [newUser] = await User.create([{
                email,
                userName,
                password: hashedPass,
                phoneNumber,
                role: roles.ADMIN,
            }], { session })

            clinic = await Clinic.create([{
                userId: newUser._id,
                clinicName,
                slug: getSlug(clinicName),
                phoneNumber,
                description,
                subscription: {
                    plan: plans.TRIAL,
                    status: "active",
                    startedAt: new Date(),
                    trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
                },
            }], { session }).then(([createdClinic]) => createdClinic)

            newUser.clinicId = clinic._id
            await newUser.save({ session })
        })

        const token = await jwtGenerator({ _id: newUser._id, clinicId: clinic._id, role: newUser.role })
        setCookies(res, token)

        return res.status(201).json({ status: statusText.SUCCESS })
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ status: statusText.FAIL, data: "Email, phone number, or clinic name is already in use" })
        }
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to create account" })
    } finally {
        await session.endSession()
    }
}

const logout = async (req, res) => {
    res.clearCookie("token", cookieOptions())
    return res.json({ status: statusText.SUCCESS, data: "Logged out successfully" })
}

const me = async (req, res) => {
    const { user } = req
    if (!user) return res.json({ status: statusText.ERROR, data: "User not Found" })
    const userData = await User.findById(user._id).select("-password")
    if (!userData) return res.status(404).json({ status: statusText.ERROR, data: "User not found" })
    return res.json({ status: statusText.SUCCESS, data: userData })
}

const getAllUsers = async (req, res) => {
    const page = req.query.page || 1
    const skip = MAIN_LIMIT * (+page - 1)
    const users = await User.find().select("-password").limit(MAIN_LIMIT).skip(skip)
    return res.json({ status: statusText.SUCCESS, data: users })
}

const updateUser = async (req, res) => {
    const { _id } = req.user
    if (!_id) return res.status(401).json({ status: statusText.ERROR, data: "Id is required" })
    try {
        const updateData = { ...req.body };
        if (updateData.email) updateData.email = updateData.email.toLowerCase()
        if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10)
        const user = await User.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password")
        if (!user) return res.status(404).json({ status: statusText.ERROR, data: "User not found" })
        return res.json({ status: statusText.SUCCESS, data: user })
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ status: statusText.FAIL, data: "Email or phone number is already in use" })
        }
        return res.status(500).json({ status: statusText.ERROR, data: "Something went wrong" })
    }
}

module.exports = {
    login,
    register,
    logout,
    me,
    updateUser,
    getAllUsers
}