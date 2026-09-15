const Clinic = require('../models/Clinic');

module.exports = async function checkSubscription(req, res, next) {
    try {
        const clinic = await Clinic.findById(req.user.clinicId);
        if (!clinic) return res.status(404).json({ data: 'Clinic not found' });

        if (!clinic.isSubscriptionActive()) {
            if (clinic.subscription.status !== 'expired') {
                clinic.subscription.status = 'expired';
                await clinic.save();
            }
            return res.status(402).json({
                data: 'Subscription expired. Please upgrade to continue.',
            });
        }

        req.clinic = clinic;
        next();
    } catch (err) {
        next(err);
    }
};