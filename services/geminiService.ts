import { GoogleGenAI, Content } from "@google/genai";
import type { ChatMessage, Language } from '../types';

// Lazily initialize the client to avoid errors on app load if the key isn't ready.
let ai: GoogleGenAI | null = null;
const getAiClient = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

/**
 * Resets the chat session. Since history is managed by the UI component,
 * this is a no-op but kept for API compatibility.
 */
export const resetChatSession = () => {
    // No session state to reset, as history is managed by the component.
};

// A more conversational system instruction that relies on prompting for the final JSON.
const systemInstruction = (language: Language) => language === 'Filipino' 
    ? "Ikaw ay isang palakaibigan at maunawaing AI medical assistant na nagngangalang Ebo mula sa Ebotika+. Ang iyong layunin ay tulungan ang mga user na maunawaan ang kanilang mga sintomas sa pamamagitan ng pag-uusap. Sundin ang mga patakarang ito nang mahigpit:\n1. Magpakilala at simulan ang pag-uusap batay sa unang mensahe ng user.\n2. Magtanong ng mga naglilinaw na katanungan isa-isa. Maging natural sa pakikipag-usap. Magtanong ng hindi bababa sa 3-4 na follow-up na tanong bago magbigay ng konklusyon.\n3. Kapag nakakalap ka na ng sapat na impormasyon para magbigay ng paunang pagtatasa, at doon lamang, DAPAT kang tumugon LAMANG gamit ang isang valid na JSON object.\n4. Ang JSON object ay dapat magkaroon ng tatlong key: \"diagnosis_suggestion\" (string), \"urgency_level\" (string, isa sa 'Low', 'Medium', 'High', 'Critical'), at \"recommendation\" (string).\n5. Ang iyong huling tugon na naglalaman ng JSON object ay hindi dapat magsama ng ANUMANG dagdag na teksto, paliwanag, o markdown formatting tulad ng ```json. Dapat ito ay ang purong JSON object lamang."
    : "You are a friendly and empathetic AI medical assistant named Ebo from Ebotika+. Your goal is to help users understand their symptoms through conversation. Follow these rules strictly:\n1. Introduce yourself and start the conversation based on the user's first message.\n2. Ask clarifying questions one by one. Be conversational and natural. Ask at least 3-4 follow-up questions before making a conclusion.\n3. When you have gathered enough information to provide a preliminary assessment, and only then, you MUST respond ONLY with a valid JSON object.\n4. The JSON object must have three keys: \"diagnosis_suggestion\" (string), \"urgency_level\" (string, one of 'Low', 'Medium', 'High', 'Critical'), and \"recommendation\" (string).\n5. Your final response containing the JSON object must not include ANY extra text, explanations, or markdown formatting like ```json. It should be the raw JSON object only.";


/**
 * Generates a streaming chat response from the Gemini API.
 * It builds a chat session on-the-fly using the provided history.
 */
export async function* streamAiChatResponse(history: ChatMessage[], language: Language) {
    const geminiHistory: Content[] = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // The user's latest message is the new prompt. The rest is history.
    const lastUserMessageContent = geminiHistory.pop();
    if (!lastUserMessageContent) {
        return;
    }

    const aiClient = getAiClient();
    const chatSession = aiClient.chats.create({
        model: 'gemini-2.5-flash',
        history: geminiHistory,
        config: {
            systemInstruction: systemInstruction(language),
        }
    });
    
    const lastMessageText = (lastUserMessageContent.parts[0] as {text: string}).text;
    
    // Fix: The sendMessageStream method expects an object with a `message` property.
    const result = await chatSession.sendMessageStream({ message: lastMessageText });

    for await (const chunk of result) {
        yield chunk.text;
    }
}