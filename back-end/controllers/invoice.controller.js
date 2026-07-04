const Invoice = require("../models/invoice");
const Clinic = require("../models/Clinic");
const { MAIN_LIMIT } = require("../data/constants")

exports.createInvoice = async (req, res) => {
    const _id = req.user._id || null;
    if (!_id) return res.status(401).json({ message: "Unauthorized" });
    const { amount, type, details } = req.body;
    try {
        const clinic = await Clinic.findOne({ userId: _id });
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });
        const invoice = new Invoice({ clinicId: clinic._id, amount, type, details });
        await invoice.save();
        res.status(201).json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getInvoices = async (req, res) => {
    const _id = req.user._id || null;
    if (!_id) return res.status(401).json({ message: "Unauthorized" });
    const page = Number(req.query.page) || 1;
    const limit = MAIN_LIMIT
    const skip = (page - 1) * limit;
    const { type, minAmount, maxAmount } = req.query;
    try {
        const clinic = await Clinic.findOne({ userId: _id });
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });
        let filters = { clinicId: clinic._id }
        if (type) filters.type = type;
        if (minAmount) filters.amount = { ...filters.amount, $gte: Number(minAmount) };
        if (maxAmount && maxAmount > 0) filters.amount = { ...filters.amount, $lte: Number(maxAmount) };
        // if (date) filters.date = date;
        const invoices = await Invoice.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateInvoice = async (req, res) => {
    const _id = req.user._id || null;
    if (!_id) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const { amount, type, details } = req.body;
    try {
        const clinic = await Clinic.findOne({ userId: _id });
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });
        const invoice = await Invoice.findOneAndUpdate(
            { _id: id, clinicId: clinic._id },
            { amount, type, details },
            { returnDocument: "after" }
        );
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.overview = async (req, res) => {
    const _id = req.user._id || null;
    if (!_id) return res.status(401).json({ message: "Unauthorized" });
    try {
        const clinic = await Clinic.findOne({ userId: _id });
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });
        const [
            totalInvoices,
            data
        ] = await Promise.all([
            Invoice.countDocuments({ clinicId: clinic._id }),
            Invoice.aggregate([
                { $match: { clinicId: clinic._id } },
                { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
            ])
        ]);
        const totalIncome = data.find((d) => d._id === "income")?.totalAmount || 0;
        const totalOutcome = data.find((d) => d._id === "outcome")?.totalAmount || 0;
        const balance = totalIncome - totalOutcome;
        res.json({ totalInvoices, totalIncome, totalOutcome, balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};