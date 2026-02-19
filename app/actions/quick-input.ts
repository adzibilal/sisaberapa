"use server";

import OpenAI from "openai";
import { db } from "@/db";
import { categories, fundSources } from "@/db/schema";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export type QuickInputResult = {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  categoryId: number | null;
  fundSourceId: number;
  date: string; // ISO Date string
};

export async function processQuickInput(
  text: string,
): Promise<QuickInputResult> {
  // 1. Fetch context from DB
  const allCategories = await db.select().from(categories);
  const allSources = await db.select().from(fundSources);
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const prompt = `
    You are a helpful financial assistant for the app "SisaBerapa".
    Your goal is to extract transaction details from the user's input text.

    Current Date: ${today}
    
    User Input: "${text}"
    
    Context Data:
    - Categories: ${JSON.stringify(allCategories.map((c) => ({ id: c.id, name: c.name })))}
    - Fund Sources: ${JSON.stringify(allSources.map((s) => ({ id: s.id, name: s.name })))}
    
    Extraction Rules:
    1. **Type**: Determine if it is "INCOME" (pemasukan/gajian) or "EXPENSE" (pengeluaran/beli). Default to "EXPENSE".
    2. **Amount**: Extract the numeric amount. Handle "k" (thousand), "jt" (million), etc.
    3. **Date**: Extract the date if mentioned (e.g., "kemarin", "besok", "tgl 20", "2023-12-25").
       - If "kemarin" (yesterday), calculate the date based on Current Date.
       - If no date is mentioned, use Current Date.
       - Return date in "YYYY-MM-DD" format.
    4. **Category**: Match the input to the most relevant Category ID.
    5. **Fund Source**: Match the input to the most relevant Fund Source ID.
       - If not mentioned, pick the most likely default (e.g. "Cash" or "Wallet") or the first available ID.
    6. **Description**: Clean up the input text to be a concise transaction title (e.g., "beli nasi goreng" -> "Nasi Goreng").
    
    Output Format (JSON only):
    {
      "amount": number,
      "type": "INCOME" | "EXPENSE",
      "description": string,
      "categoryId": number,
      "fundSourceId": number,
      "date": string
    }
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const jsonText = completion.choices[0].message.content ?? "{}";
    const data = JSON.parse(jsonText);

    // Fallback if AI fails to return valid data or returns partial
    return {
      amount: Number(data.amount) || 0,
      type:
        data.type === "INCOME" || data.type === "EXPENSE"
          ? data.type
          : "EXPENSE",
      description: data.description || text,
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      fundSourceId: data.fundSourceId
        ? Number(data.fundSourceId)
        : allSources[0]?.id || 0,
      date: data.date || new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error("AI Error Details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`AI Error: ${errorMessage}`);
  }
}
