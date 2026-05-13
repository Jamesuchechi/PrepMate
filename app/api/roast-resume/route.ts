import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion } from '@/lib/agentic-ai';

export async function POST(req: NextRequest) {
  try {
    const { resume_data, role } = await req.json();

    if (!resume_data) {
      return NextResponse.json({ error: 'No resume data provided' }, { status: 400 });
    }

    const prompt = `
You are a top-tier Silicon Valley technical recruiter known for being "brutally honest" and extremely witty. 
Your goal is to ROAST the following candidate's resume data. 

Guidelines:
- Be funny, sarcastic, but ultimately helpful.
- Critique the skills: Are they outdated? Too generic?
- Critique the projects: Do they sound like "tutorial projects"?
- Focus on the "Summary": Is it a boring corporate cliche?
- Mention the target role: ${role || 'Software Engineer'}

Structure the roast into 3 short paragraphs:
1. The "Initial Cringe" (First impression)
2. The "Hard Truth" (What's actually wrong)
3. The "Redemption Arc" (How to fix it)

Resume Data:
${JSON.stringify(resume_data, null, 2)}

Return ONLY the text of the roast. No preamble.
`.trim();

    const roast = await generateChatCompletion({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      jsonMode: false,
    });

    return NextResponse.json({ roast });
  } catch (error: any) {
    console.error('Roast API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
