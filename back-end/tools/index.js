const tools = [
    {
        name: "book_appointment",
        description:
            "Book a new appointment for a patient. Only call this after you've " +
            "all required fields — don't guess or invent a phone number or name.",
        parameters: {
            type: "object",
            properties: {
                patientName: { type: "string", description: "Full name of the patient." },
                patientPhoneNumber: { type: "string", description: "Patient's phone number." },
                patientAddress: { type: "string", description: "Patient's Address." },
                date: { type: "string", description: "ISO Full Data" },
                notes: { type: "string", description: "notes that user write and its optional" }
            },
            required: ["patientName", "patientPhoneNumber", "patientAddress", "date"],
        },
    },
    // {
    //     name: "find_patient_appointments",
    //     description:
    //         "Look up a patient's upcoming appointments by phone number. Use this when " +
    //         "someone asks 'do I have an appointment' or wants to check/cancel an existing booking.",

    //     input_schema: {
    //         type: "object",
    //         properties: {
    //             phone: { type: "string", description: "Patient's phone number." },
    //         },
    //         required: ["phone"],
    //     },
    // }
];

module.exports = tools;