import { useState, useRef, useEffect } from "react"
import { sendAssistantMessage, type Message } from "../services/assistant"
import ReactMarkdown from 'react-markdown'

interface ChatAssistantProps {
    clinicId: string
    clinicName: string
}

export default function ChatAssistant({ clinicId, clinicName }: ChatAssistantProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "model",
            content: `مرحبا! أنا مساعد ${clinicName} الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك حجز موعد أو الاستفسار عن الخدمات.`,
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await sendAssistantMessage([...messages, userMessage], clinicId)

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "model",
                content: response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error("Error:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "model",
                content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-96 h-96 mb-4 border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <h3 className="font-bold text-lg">مساعد {clinicName}</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-blue-800 p-1 rounded transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === "user"
                                        ? "bg-blue-100 text-gray-800 rounded-bl-none"
                                        : "bg-blue-600 text-white rounded-br-none"
                                        }`}
                                >
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    {/* <p className="text-sm whitespace-pre-wrap break-words">{msg.content.trim()}</p> */}
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {msg.timestamp.toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg rounded-br-none">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="اكتب رسالتك..."
                                disabled={isLoading}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 text-right"
                                dir="rtl"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                            >
                                إرسال
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-xl font-bold transform hover:scale-110 ${isOpen
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
            >
                {isOpen ? "✕" : "💬"}
            </button>
        </div>
    )
}
