import api from "../config/api"

export interface Message {
    id: string
    role: 'user' | 'model'
    content: string
    timestamp: Date
}

export const sendAssistantMessage = async (msgs: Message[], clinicId: string) => {
    try {
        const response = await api.post("/assistant", {
            msgs,
            clinicId
        })
        return response.data.result
    } catch (error) {
        console.error("Error sending message to assistant:", error)
        throw error
    }
}
