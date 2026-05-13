import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(request: Request) {
  try {
    const { bullet } = await request.json();

    if (!bullet) {
      return NextResponse.json({ error: "No bullet provided" }, { status: 400 });
    }

    const prompt = `
You are an elite career coach and resume expert. Transform the following raw resume bullet into 3 high-impact versions using the STAR (Situation, Task, Action, Result) framework.

Raw Bullet: "${bullet}"

Rules:
- Focus on measurable results (%, $, time, scale).
- Use strong action verbs (Led, Architected, Optimized, Spearheaded).
- Ensure each version has a different "flavor" (e.g., one more technical, one more leadership-focused).
- Assign an "impact_score" (0-100) based on how effective the bullet is.

Return ONLY valid JSON in this exact format:
{
  "options": [
    {
      "bullet": "The refined bullet text",
      "impact_score": number,
      "flavor": "Leadership/Technical/Efficiency"
    }
  ]
}
`.trim();

    const result = await generateChatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      jsonMode: true,
    });

    if (!result) {
      throw new Error("Failed to refine bullet");
    }

    // Strip markdown fences if present
    const cleanResult = result.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(cleanResult);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error refining bullet:", error);
    return NextResponse.json({ error: error.message || "Failed to refine bullet" }, { status: 500 });
  }
}
