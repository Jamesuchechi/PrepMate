import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(request: Request) {
  try {
    const { resume_data, job_description } = await request.json();

    if (!resume_data || !job_description) {
      return NextResponse.json({ error: "Missing resume data or job description" }, { status: 400 });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Recruiter. 
Analyze the following resume data against the provided Job Description (JD).

Resume Data:
${JSON.stringify(resume_data, null, 2)}

Job Description:
${job_description}

Tasks:
1. Calculate an "ats_score" (0-100) based on keyword match, role alignment, and experience level.
2. Identify "missing_keywords" (top 5-8 skills or terms in the JD not found in the resume).
3. Provide "tailoring_suggestions" (3 specific ways to rewrite bullets or summary to better match the JD).
4. Generate a "tailored_summary" that bridges the gap between the candidate and this specific role.

Return ONLY valid JSON in this exact format:
{
  "ats_score": number,
  "missing_keywords": ["keyword1", "keyword2"],
  "tailoring_suggestions": ["suggestion1", "suggestion2"],
  "tailored_summary": "The new summary text"
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
      throw new Error("Failed to optimize resume");
    }

    // Strip markdown fences if present
    const cleanResult = result.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(cleanResult);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error optimizing resume:", error);
    return NextResponse.json({ error: error.message || "Failed to optimize resume" }, { status: 500 });
  }
}
