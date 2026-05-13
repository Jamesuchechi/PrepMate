import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(request: Request) {
  try {
    const { role, experience_level, interview_type, asked_questions, resume_data, coach_personality, target_company } = await request.json();

    if (!role || !experience_level || !interview_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Personality configuration
    const personalities: Record<string, string> = {
      mentor: "You are 'The Mentor'. You are encouraging, empathetic, and focus on growth. Your questions should be supportive but challenging.",
      drill_sergeant: "You are 'The Drill Sergeant'. You are strict, direct, and focus on high-pressure performance. Your questions should be blunt and emphasize precision.",
      tech_lead: "You are 'The Tech Lead'. You are detail-oriented, skeptical, and focus on technical mastery. Your questions should be deep dives into 'how' and 'why'."
    };

    // Company specific context
    const companyContexts: Record<string, string> = {
      google: "This is a Google interview. Focus on 'Googlyness', scale, and high-impact problem solving. For technical roles, emphasize algorithmic efficiency.",
      amazon: "This is an Amazon interview. Focus HEAVILY on the 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, etc.). Every behavioral question should probe for these principles.",
      meta: "This is a Meta interview. Focus on 'Move Fast', impact, and building at scale. Questions should be direct and results-oriented.",
      netflix: "This is a Netflix interview. Focus on the 'Netflix Culture Memo': Radical Candor, High Performance, and Context not Control.",
      apple: "This is an Apple interview. Focus on design excellence, secrecy, attention to detail, and a 'customer-first' experience."
    };

    const coachPrompt = personalities[coach_personality] || personalities.mentor;
    const companyPrompt = target_company ? companyContexts[target_company] || `This is an interview at ${target_company}.` : "This is a general professional interview.";

    // Build the personalization context
    let context = "";
    if (resume_data) {
      context = `
The candidate's resume includes:
- Skills: ${resume_data.skills?.join(', ') || 'Not specified'}
- Key Projects: ${resume_data.projects?.join(', ') || 'Not specified'}
- Summary: ${resume_data.summary || 'Not specified'}

Use this information to occasionally ask specific questions about their projects or skills.
      `.trim();
    }

    const prompt = `
${coachPrompt}
${companyPrompt}

You are conducting a ${interview_type} interview for a ${experience_level}-level ${role} position.

${context}

Generate ONE interview question that:
- Is appropriate for the experience level
- Has NOT been asked before (avoid: ${asked_questions?.join(', ') || 'none'})
- Follows best practices for ${interview_type} interviews
- Is specific, realistic, and evaluable
- Matches your assigned personality tone
- Matches the specific culture and hiring bar of ${target_company || 'the target company'}
- If resume data is provided, try to make the question related to one of their projects or skills.

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
