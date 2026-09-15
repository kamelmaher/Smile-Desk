const Invoice = require("../models/Invoice");
const mongoose = require("mongoose");
const statusText = require("../data/statusText");
const { MAIN_LIMIT } = require("../data/constants")

exports.createInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.create({ ...req.body, clinicId: req.clinic._id });
        return res.status(201).json({ status: statusText.SUCCESS, data: invoice });
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to create invoice" });
    }
};

exports.getInvoices = async (req, res) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = MAIN_LIMIT;
    const skip = (page - 1) * limit;
    const { type, minAmount, maxAmount } = req.query;
    try {
        if (type && !["income", "outcome"].includes(type)) {
            return res.status(400).json({ status: statusText.ERROR, data: "Invalid invoice type" });
        }

        const minimum = minAmount === undefined ? undefined : Number(minAmount);
        const maximum = maxAmount === undefined ? undefined : Number(maxAmount);
        if ((minimum !== undefined && (!Number.isFinite(minimum) || minimum < 0)) ||
            (maximum !== undefined && (!Number.isFinite(maximum) || maximum < 0)) ||
            (minimum !== undefined && maximum !== undefined && minimum > maximum)) {
            return res.status(400).json({ status: statusText.ERROR, data: "Invalid amount filters" });
        }

        const filters = { clinicId: req.clinic._id };
        if (type) filters.type = type;
        if (minimum !== undefined || maximum !== undefined) {
            filters.amount = {};
            if (minimum !== undefined) filters.amount.$gte = minimum;
            if (maximum !== undefined) filters.amount.$lte = maximum;
        }

        const [invoices, total] = await Promise.all([
            Invoice.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Invoice.countDocuments(filters),
        ]);
        return res.status(200).json({ status: statusText.SUCCESS, invoices, pages: Math.ceil(total / limit) });
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to load invoices" });
    }
};

exports.updateInvoice = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: statusText.ERROR, data: "Invalid invoice id" });
    }
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { _id: id, clinicId: req.clinic._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!invoice) return res.status(404).json({ status: statusText.ERROR, data: "Invoice not found" });
        return res.status(200).json({ status: statusText.SUCCESS, data: invoice });
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to update invoice" });
    }
};

exports.overview = async (req, res) => {
    try {
        const [
            totalInvoices,
            data
        ] = await Promise.all([
            Invoice.countDocuments({ clinicId: req.clinic._id }),
            Invoice.aggregate([
                { $match: { clinicId: req.clinic._id } },
                { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
            ])
        ]);
        const totalIncome = data.find((d) => d._id === "income")?.totalAmount || 0;
        const totalOutcome = data.find((d) => d._id === "outcome")?.totalAmount || 0;
        const balance = totalIncome - totalOutcome;
        return res.json({
            status: statusText.SUCCESS,
            overview: { totalInvoices, totalIncome, totalOutcome, balance },
        });
    } catch (err) {
        return res.status(500).json({ status: statusText.ERROR, data: "Unable to load invoice overview" });
    }
};