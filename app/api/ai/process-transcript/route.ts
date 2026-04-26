import { NextResponse } from "next/server";
import { processTranscript } from "@/lib/ai/transcript";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await processTranscript(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transcript processing failed" },
      { status: 400 }
    );
  }
}
