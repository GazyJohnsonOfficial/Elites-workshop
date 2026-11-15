import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, category } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `You are the Elites Tech Academy Expert Advisor. A student studying "${category || "Cloud, Data & DevOps"}" is searching for real-time industry trends, documentation, or best practices regarding: "${query}". Provide a concise, professional, structured breakdown with actionable insights, industry standards (AWS, Azure, GCP, Terraform, Kubernetes, etc.), and reference guidance.`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert technical solutions architect and curriculum lead at Elites Tech Solutions LLC. Provide accurate, up-to-date, real-time grounded insights and documentation references for cloud engineers and data professionals.",
      },
    });

    const text = response.text || "No insights found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = chunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    return NextResponse.json({ text, sources });
  } catch (error: any) {
    console.error("Academy search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch real-time cloud insights" },
      { status: 500 }
    );
  }
}
