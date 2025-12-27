
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { KnowledgeItem, ChatMessage } from "../types.ts";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private modelName = 'gemini-3-flash-preview';

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("API Key not found in process.env.API_KEY. Gemini service will be limited.");
    }
  }

  private constructSystemInstruction(knowledge: KnowledgeItem[]): string {
    const context = knowledge.map(k => `--- KNOWLEDGE: ${k.title} ---\n${k.content}`).join('\n\n');
    
    return `
      You are KnowledgeBot Pro, a highly intelligent AI assistant. 
      You have access to a specific Knowledge Base provided by the user.
      
      RULES:
      1. Use ONLY the provided knowledge base to answer questions whenever possible.
      2. If the answer is not in the knowledge base, explicitly state that you couldn't find it in the internal data, but provide a general answer if appropriate.
      3. Maintain a professional, helpful tone.
      4. Use Markdown for formatting (bold, lists, tables).
      
      CURRENT KNOWLEDGE BASE CONTEXT:
      ${context || "The knowledge base is currently empty. Please inform the user."}
    `;
  }

  async generateResponse(
    message: string, 
    history: ChatMessage[], 
    knowledge: KnowledgeItem[]
  ): Promise<string> {
    if (!this.ai) {
      return "Error: AI Service not initialized. Please ensure the API Key is correctly configured.";
    }

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: this.constructSystemInstruction(knowledge),
          temperature: 0.7,
        }
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An error occurred while connecting to the AI brain. Please check your connection.";
    }
  }
}

export const geminiService = new GeminiService();
