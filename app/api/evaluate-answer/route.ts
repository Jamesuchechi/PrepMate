import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({ message: "Evaluate answer endpoint - Under construction" }, { status: 200 });
}
