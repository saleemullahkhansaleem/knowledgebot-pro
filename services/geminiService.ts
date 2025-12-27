import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { KnowledgeItem, ChatMessage } from "../types.ts";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private readonly modelName = "gemini-3-flash-preview";
  private readonly temperature = 0.7;

  constructor() {
    const apiKey = (
      process.env.API_KEY ||
      process.env.GEMINI_API_KEY ||
      ""
    ).trim();
    if (!apiKey) {
      console.error(
        "❌ API Key not found. Set GEMINI_API_KEY in .env.local and restart dev server."
      );
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private buildSystemInstruction(knowledge: KnowledgeItem[]): string {
    const context = knowledge
      .map((k) => `--- KNOWLEDGE: ${k.title} ---\n${k.content}`)
      .join("\n\n");
    return `You are KnowledgeBot Pro, a highly intelligent AI assistant with access to a specific Knowledge Base.

RULES:
1. Use ONLY the provided knowledge base to answer questions whenever possible.
2. If the answer is not in the knowledge base, state that explicitly but provide a general answer if appropriate.
3. Maintain a professional, helpful tone.
4. Use Markdown for formatting (bold, lists, tables).

CURRENT KNOWLEDGE BASE CONTEXT:
${context || "The knowledge base is currently empty. Please inform the user."}`;
  }

  private mapHistoryToContents(history: ChatMessage[], message: string) {
    return [
      ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      { role: "user" as const, parts: [{ text: message }] },
    ];
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
      const response: GenerateContentResponse =
        await this.ai.models.generateContent({
          model: this.modelName,
          contents: this.mapHistoryToContents(history, message),
          config: {
            systemInstruction: {
              parts: [{ text: this.buildSystemInstruction(knowledge) }],
            },
            temperature: this.temperature,
          },
        });

      return (
        response.text ||
        "I'm sorry, I couldn't generate a response. The API returned an empty response."
      );
    } catch (error: any) {
      console.error("Gemini Error:", error);

      if (
        error?.error?.code === 400 &&
        error?.error?.message?.includes("API key")
      ) {
        return `❌ Invalid API Key: ${error.error.message}. Please verify your GEMINI_API_KEY in .env.local is valid (get one from https://makersuite.google.com/app/apikey) and restart the dev server.`;
      }

      return `Error: ${
        error?.message || "Unknown error"
      }. Please check your API key and connection.`;
    }
  }
}

export const geminiService = new GeminiService();
