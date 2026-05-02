const User = require("../models/User")
const Clinic = require("../models/Clinic")
const statusText = require("../data/statusText")
const bcrypt = require("bcryptjs")
const roles = require("../data/roles")
const jwtGenerator = require("../utils/jwtGenerator")
const getSlug = require("../utils/geSlug")

const login = async (req, res) => {
    const { email, password } = req.body
    // Check Empty Feilds
    if (!email || !password) return res.json({ status: statusText.FAIL, data: "Missing Fields" })

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) return res.json({ status: statusText.FAIL, data: "check Email or Password" })

    // compare Passwords
    const hashedPassword = user.password
    const isMatched = await bcrypt.compare(password, hashedPassword)
    if (!isMatched) return res.json({ status: statusText.FAIL, data: "check Email or Password" })

    // generate token
    const token = await jwtGenerator({ _id: user._id, clinicId: user.clinicId, role: user.role })
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ status: statusText.SUCCESS, data: "User Logged in successfully" })
}

const register = async (req, res) => {
    try {
        const { email, password, userName, clinicName, phoneNumber, description } = req.body
        // check if email not in use
        const emailFound = await User.findOne({ email })
        if (emailFound)
            return res.json({ status: statusText.FAIL, data: "user already exsists" })

        // Check Clinic Name 
        const clinicNameFound = await Clinic.findOne({ clinicName })
        if (clinicNameFound)
            return res.json({ status: statusText.FAIL, data: "cant use this clinic name" })

        // password hash 
        const hashedPass = await bcrypt.hash(password, 10)

        // create user
        const newUser = await User.create({
            email,
            userName,
            password: hashedPass,
            phoneNumber,
            role: roles.ADMIN,
        })
        // create clinic
        const slug = getSlug(clinicName)
        const clinic = await Clinic.create({
            userId: newUser._id,
            clinicName,
            slug,
            description: description
        })

        // generate token
        const token = await jwtGenerator({ _id: newUser.id, clinicId: clinic._id, role: newUser.role })

        //update user
        await User.updateOne(
            { _id: newUser._id },
            { $set: { clinicId: clinic._id } },
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ status: statusText.SUCCESS })
    } catch (err) {
        res.json({ status: statusText.ERROR, data: err })
    }
}

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    })
    res.json({ status: statusText.SUCCESS, data: "Logout Succefully" })
}

const me = async (req, res) => {
    const { user } = req
    if (!user) return res.json({ status: statusText.ERROR, data: "User not Found" })
    const userData = await User.findById(user._id)
    res.json({ status: statusText.SUCCESS, data: userData })
}

const updateUser = async (req, res) => {
    const { _id } = req.user
    if (!_id) return res.josn({ status: statusText.ERROR, data: "Id is required" })
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { returnDocument: "after" })
        res.json({ status: statusText.SUCCESS, data: user })
    } catch (err) {
        res.json({ status: statusText.ERROR, data: "Something went wrong" })
    }
}

const subscribe = async (req, res) => {
    const user = req.user
    const updated = await User.findByIdAndUpdate(user._id, { isActive: true })
}

module.exports = {
    login,
    register,
    logout,
    me,
    updateUser
}