const bookAppointment = require("./bookAppointment");

exports.executor = async (name, args, clinicId) => {
    switch (name) {
        case "book_appointment": return await bookAppointment(args, clinicId);
        default: throw new Error("Tool Not Found")
    }
}