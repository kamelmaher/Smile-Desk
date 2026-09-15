const Clinic = require('../models/Clinic');
const statusText = require('../data/statusText');

module.exports = async function checkSubscription(req, res, next) {
    try {
        const clinicId = req.user ? req.user.clinicId : req.body?.clinicId || req.query?.clinicId || req.params?.clinicId;
        if (!clinicId) {
            const statusCode = req.user ? 403 : 400;
            return res.status(statusCode).json({
                status: statusText.ERROR,
                data: req.user ? 'Clinic is not assigned to this user' : 'Clinic id is required',
            });
        }
        const clinic = await Clinic.findById(clinicId);
        if (!clinic) return res.status(404).json({ status: statusText.ERROR, data: 'Clinic not found' });

        if (!clinic.isSubscriptionActive()) {
            if (clinic.subscription.status !== 'expired') {
                clinic.subscription.status = 'expired';
                await clinic.save();
            }
            return res.status(402).json({
                status: statusText.ERROR,
                data: 'Subscription expired. Please upgrade to continue.',
            });
        }

        req.clinic = clinic;
        return next();
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: statusText.ERROR, data: 'Invalid clinic id' });
        }
        return res.status(500).json({ status: statusText.ERROR, data: 'Unable to verify subscription' });
    }
};