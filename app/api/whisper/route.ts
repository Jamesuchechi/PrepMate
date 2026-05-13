import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert Blob to File for the Groq API
    const groqFormData = new FormData();
    groqFormData.append('file', file, 'audio.webm');
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('response_format', 'json');
    groqFormData.append('language', 'en');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq Whisper Error:', data);
      return NextResponse.json({ error: data.error?.message || 'Failed to transcribe' }, { status: response.status });
    }

    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error('Whisper API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
