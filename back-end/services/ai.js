const ai = require("../config/ai")
const tools = require("../tools/index")
const { executor } = require("../tools/executer")
const MODEL = "gemini-3.6-flash"

const classifyMessages = (messages) => {
    if (!messages) return []
    return messages.map(msg => ({ role: msg.role, parts: [{ text: msg.content }] }))
}

exports.generateResponse = async (msgs, clinicId) => {
    const res = await ai.models.generateContent({
        model: MODEL,
        contents: classifyMessages(msgs),
        config: {
            tools: [
                {
                    functionDeclarations: tools
                }
            ]
        }
    })

    const functionCall = res.functionCalls?.[0]
    if (!functionCall) return res.text
    console.log("function call")
    const candidateContent = res.candidates[0].content;
    const { name, args } = functionCall
    const result = await executor(name, args, clinicId);
    const finalResponse = await ai.models.generateContent({
        model: MODEL,
        contents: [
            ...classifyMessages(msgs),
            candidateContent,
            {
                role: 'user',
                parts: [
                    {
                        functionResponse: {
                            name: name,
                            response: result,
                        },
                    },
                ],
            }
        ],
        config: {
            tools: [{ functionDeclarations: tools }]
        }
    })
    return finalResponse.text;
}