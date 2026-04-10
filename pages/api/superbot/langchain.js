/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { ChatGroq } from "@langchain/groq"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"

const getKey = () => {
  const keys = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3
  ].filter(Boolean)
  return keys[Math.floor(Math.random() * keys.length)]
}

export async function langchainChat(message, history = [], systemPrompt = "") {
  try {
    const model = new ChatGroq({
      apiKey: getKey(),
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      maxTokens: 1024,
    })

    const messages = [
      new SystemMessage(systemPrompt || "Tu es REUSSITESS AI, assistant né en Guadeloupe. BOUDOUM !"),
      ...history.slice(-6).map(m =>
        m.role === "user"
          ? new HumanMessage(m.content?.substring(0, 400) || "")
          : new AIMessage(m.content?.substring(0, 400) || "")
      ),
      new HumanMessage(message)
    ]

    const response = await model.invoke(messages)
    return response.content || null
  } catch(e) {
    console.error("LangChain error:", e.message)
    return null
  }
}
