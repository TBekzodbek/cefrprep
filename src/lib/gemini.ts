import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getAIResponse = async (prompt: string) => {
    if (!API_KEY) {
        return "AI API Key is missing. Please add VITE_GEMINI_API_KEY to environment variables.";
    }
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return `AI Error: ${error.message || "Could not connect to Google AI"}`;
    }
};
