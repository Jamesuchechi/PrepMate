import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(request: Request) {
  try {
    const { question, answer, role, experience_level, interview_type } = await request.json();

    if (!question || !answer || !role || !experience_level || !interview_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
You are an expert interview coach evaluating a candidate's answer.

Role: ${role}
Experience Level: ${experience_level}
Interview Type: ${interview_type}
Question: ${question}
Answer: ${answer}

Score this answer from 0-100 across four dimensions:
- Clarity: How clearly and concisely the answer communicates
- Confidence: How assured and decisive the language is
- Structure: How logically organized the response is (STAR method for behavioral)
- Relevance: How directly the answer addresses the question

Return ONLY valid JSON in this exact format:
{
  "scores": {
    "clarity": number,
    "confidence": number,
    "structure": number,
    "relevance": number,
    "overall": number
  },
  "feedback": "2-4 sentence detailed feedback string",
  "improvement_tip": "One specific, actionable improvement"
}
`.trim();

    let evaluation;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
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
          throw new Error("Empty response from AI");
        }

        // Strip markdown fences if present
        const cleanResult = result.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        evaluation = JSON.parse(cleanResult);
        break; // Successfully parsed
      } catch (parseError) {
        attempts++;
        console.warn(`Attempt ${attempts} failed to parse JSON:`, parseError);
        if (attempts >= maxAttempts) {
          throw new Error("Failed to parse AI response after multiple attempts");
        }
      }
    }

    return NextResponse.json(evaluation, { status: 200 });
  } catch (error: any) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json({ error: error.message || "Failed to evaluate answer" }, { status: 500 });
  }
}
