import type { ChatMessage, AISummary, Language } from '../types';
// In a real application, you would import the actual Gemini client
// import { GoogleGenAI, Type } from "@google/genai";

// Mock implementation - English
const mockResponsesEn: string[] = [
  "Okay, I understand. Can you tell me more about the symptoms? For example, when did they start?",
  "Thank you for that information. Are you experiencing any other symptoms, like a fever or body aches?",
  "I see. One last question, on a scale of 1 to 10, how would you rate the discomfort?",
];

const mockSummaryEn: AISummary = {
  diagnosis_suggestion: "Possible Common Cold or Flu",
  urgency_level: "Low",
  recommendation: `Based on your symptoms, here are some recommendations:
  
• Rest and stay well-hydrated by drinking plenty of fluids.
• You may take over-the-counter pain relievers like Paracetamol for fever or aches, as directed.
• Monitor your symptoms closely.
  
Please consult a doctor if:
- Your symptoms worsen after 3 days.
- You develop a high fever (above 38.5°C or 101.3°F).
- You experience difficulty breathing.`
};

// Mock implementation - Tagalog
const mockResponsesTg: string[] = [
    "Okay, naiintindihan ko. Maaari mo bang sabihin ang iba pang detalye tungkol sa mga sintomas? Halimbawa, kailan ito nagsimula?",
    "Salamat sa impormasyon. Mayroon ka pa bang ibang nararamdaman, tulad ng lagnat o pananakit ng katawan?",
    "Naiintindihan ko. Huling tanong, sa sukat na 1 hanggang 10, gaano mo kalala ang nararamdamang sakit?",
];

const mockSummaryTg: AISummary = {
  diagnosis_suggestion: "Posibleng Karaniwang Sipon o Trangkaso",
  urgency_level: "Low",
  recommendation: `Base sa iyong mga sintomas, narito ang ilang rekomendasyon:

• Magpahinga at uminom ng maraming tubig.
• Maaari kang uminom ng over-the-counter na gamot tulad ng Paracetamol para sa lagnat o pananakit, ayon sa direksyon.
• Subaybayan nang mabuti ang iyong mga sintomas.

Mangyaring kumonsulta sa doktor kung:
- Lumala ang iyong mga sintomas pagkatapos ng 3 araw.
- Magkaroon ka ng mataas na lagnat (higit sa 38.5°C o 101.3°F).
- Mahirapan kang huminga.`
};

export const streamChatResponse = async function* (history: ChatMessage[], language: Language) {
    await new Promise(res => setTimeout(res, 1000));
    
    const isTagalog = language === 'Tagalog';
    const mockResponses = isTagalog ? mockResponsesTg : mockResponsesEn;
    const mockSummary = isTagalog ? mockSummaryTg : mockSummaryEn;
    
    const turn = history.filter(m => m.sender === 'ai').length;

    if (turn < mockResponses.length) {
        const responseText = mockResponses[turn];
        for (let i = 0; i < responseText.length; i++) {
            await new Promise(res => setTimeout(res, 20));
            yield responseText[i];
        }
    } else {
        const jsonString = JSON.stringify(mockSummary, null, 2);
         for (let i = 0; i < jsonString.length; i++) {
            await new Promise(res => setTimeout(res, 10));
            yield jsonString[i];
        }
    }
};

/**
 * NOTE: This is how a real implementation would look.
 * The mock above is used for demonstration purposes.
 */
/*
import { GoogleGenAI, Type, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
let chat: Chat | null = null;

export const getAiChat = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are Ebotika+, an AI health assistant for community health triage.
First act like a doctor by asking clarifying questions.
After 2-3 exchanges, provide a final structured JSON summary.
Requirements:
1. Respond fully in Tagalog or English (based on user setting).
2. During chat: ask doctor-style follow-up questions.
3. Final output: only JSON in this format:
   {
     "diagnosis_suggestion": "...",
     "urgency_level": "...",
     "recommendation": "..."
   }
4. No extra text outside JSON for the summary.`
            }
        });
    }
    return chat;
}

export const getAiResponse = async (message: string) => {
    const chatInstance = getAiChat();
    const response = await chatInstance.sendMessageStream({ 
        message,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    diagnosis_suggestion: { type: Type.STRING },
                    urgency_level: { type: Type.STRING },
                    recommendation: { type: Type.STRING }
                },
                required: ["diagnosis_suggestion", "urgency_level", "recommendation"]
            }
        }
    });
    return response;
};
*/
