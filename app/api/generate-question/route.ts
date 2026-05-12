import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({ message: "Generate question endpoint - Under construction" }, { status: 200 });
}
