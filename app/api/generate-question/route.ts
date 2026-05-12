import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(request: Request) {
  try {
    const { role, experience_level, interview_type, asked_questions } = await request.json();

    if (!role || !experience_level || !interview_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
You are a senior hiring manager conducting a ${interview_type} interview
for a ${experience_level}-level ${role} position.

Generate ONE interview question that:
- Is appropriate for the experience level
- Has NOT been asked before (avoid: ${asked_questions?.join(', ') || 'none'})
- Follows best practices for ${interview_type} interviews
- Is specific, realistic, and evaluable

Return ONLY the question. No preamble, no numbering.
`.trim();

    const question = await generateChatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      jsonMode: false,
    });

    if (!question) {
      throw new Error("Failed to generate question");
    }

    return NextResponse.json({ question }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating question:", error);
    return NextResponse.json({ error: error.message || "Failed to generate question" }, { status: 500 });
  }
}
