const dayjs = require("dayjs")

const getUpcomingDate = () => {
    const startOfTomorrow = dayjs().add(1, 'day').startOf('day').toDate();
    const endOfRange = dayjs().add(11, 'day').endOf('day').toDate();
    return { $gte: startOfTomorrow, $lte: endOfRange }
}

const getTodayDate = () => {
    const startOfDay = dayjs().startOf('day').toDate();
    const endOfDay = dayjs().endOf('day').toDate();
    return {
        $gte: startOfDay,
        $lte: endOfDay
    }
}

const getExpiredDate = () => {
    const now = dayjs().toDate();
    return {
        $lt: now
    }
}
module.exports = {
    getTodayDate,
    getExpiredDate,
    getUpcomingDate
}