"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { categories, fundSources } from "@/db/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function processQuickInput(text: string) {
  // 1. Fetch context from DB
  const allCategories = await db.select().from(categories);
  const allSources = await db.select().from(fundSources);

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text();

    console.log("AI Raw Response:", jsonText);

    // More robust JSON extraction
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return a valid JSON object");
    }

    jsonText = jsonMatch[0];
    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error("AI Error Details:", error);
    // Return the error message to help debugging
    throw new Error(`AI Error: ${error.message || "Unknown error"}`);
  }
}
