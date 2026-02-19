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
};

export async function processQuickInput(
  text: string,
): Promise<QuickInputResult> {
  // 1. Fetch context from DB
  const allCategories = await db.select().from(categories);
  const allSources = await db.select().from(fundSources);

  const prompt = `
    You are a financial assistant for an app called SisaBerapa.
    Parse the following user input into a JSON object for a transaction.
    
    User Input: "${text}"
    
    Context:
    - Categories: ${JSON.stringify(allCategories)}
    - Fund Sources: ${JSON.stringify(allSources)}
    
    Rules:
    1. Determine if it's an "INCOME" or "EXPENSE" (default is EXPENSE).
    2. Extract the amount.
    3. Match the category to the most relevant category ID from the list provided.
    4. Match the fund source to the most relevant fund source ID from the list provided. If not mentioned, pick the first one or a relevant default.
    5. Clean up the description (e.g., "beli bakso" becomes "Bakso").
    
    Return ONLY a JSON object in this format:
    {
      "amount": number,
      "type": "INCOME" | "EXPENSE",
      "description": string,
      "categoryId": number | null,
      "fundSourceId": number
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

    const jsonText = completion.choices[0].message.content ?? "";

    console.log("AI Raw Response:", jsonText);

    const data = JSON.parse(jsonText);
    return {
      amount: Number(data.amount),
      type:
        data.type === "INCOME" || data.type === "EXPENSE"
          ? data.type
          : "EXPENSE",
      description: String(data.description),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      fundSourceId: Number(data.fundSourceId),
    };
  } catch (error: unknown) {
    console.error("AI Error Details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`AI Error: ${errorMessage}`);
  }
}
