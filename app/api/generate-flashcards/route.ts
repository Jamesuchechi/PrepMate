import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    const prompt = `
You are an expert technical interviewer. Generate 10 high-quality technical flashcards for a ${role} candidate.
These should be quick-fire questions that test core concepts, recent trends, or common "gotchas" in the field.

Return ONLY valid JSON in this exact format:
{
  "cards": [
    {
      "question": "The technical question",
      "answer": "A concise, high-impact answer (2-3 sentences)",
      "tags": ["topic1", "topic2"]
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
      throw new Error("Failed to generate flashcards");
    }

    // Strip markdown fences if present
    const cleanResult = result.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(cleanResult);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: error.message || "Failed to generate flashcards" }, { status: 500 });
  }
}
