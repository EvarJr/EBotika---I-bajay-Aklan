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

// Mock implementation - Aklanon
const mockResponsesAk: string[] = [
    "Okay, naintindihan ko. Pwede mo pa bang isaysay ang mga sintomas? Halimbawa, san-o raya nagsimula?",
    "Salamat sa impormasyon. May iba ka pa bang nabatyagan, parehas it lagnat o pagsakit it kalawasan?",
    "Naintindihan ko. Isaeang pang pamangkot, sa iskaeang 1 hasta 10, paano mo i-rate ro kahasakit?",
];

const mockSummaryAk: AISummary = {
  diagnosis_suggestion: "Posibleng Trangkaso o Sip-on",
  urgency_level: "Low",
  recommendation: `Base sa imong mga sintomas, yari ro pilang rekomendasyon:

• Magpahuway ag siguraduhon nga may bastante nga inom it tubi.
• Pwede kang mag-inom it mga bulong nga mabakae sa botika parehas it Paracetamol para sa lagnat o sakit it kalawasan, suno sa direksyon.
• Bantayan it mayad ro imong mga sintomas.

Palihog magpakonsulta sa doktor kung:
- Maglala ro imong mga sintomas pagkatapos it 3 adlaw.
- Magka-high fever ka (sobra sa 38.5°C o 101.3°F).
- Mabudlayan ka sa pagginhawa.`
};

export const streamChatResponse = async function* (history: ChatMessage[], language: Language) {
    await new Promise(res => setTimeout(res, 1000));
    
    const isAklanon = language === 'Aklanon';
    const mockResponses = isAklanon ? mockResponsesAk : mockResponsesEn;
    const mockSummary = isAklanon ? mockSummaryAk : mockSummaryEn;
    
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
1. Respond fully in Aklanon or English (based on user setting).
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