import OpenAI from "openai";
import { transcriptInputSchema, transcriptOutputSchema, type TranscriptOutput } from "@/lib/validators";

function pickSnippet(transcript: string) {
  return transcript.replace(/\s+/g, " ").trim().slice(0, 220);
}

function inferTopics(text: string) {
  const lower = text.toLowerCase();
  const topics = [
    lower.includes("restructuring") || lower.includes("rx") ? "restructuring recruiting" : null,
    lower.includes("credit") ? "private credit and stressed investing" : null,
    lower.includes("speaker") || lower.includes("ucg") ? "UChicago Credit Group speaker outreach" : null,
    lower.includes("interview") || lower.includes("recruiting") ? "recruiting process and preparation" : null,
    lower.includes("special situations") ? "special situations investing" : null
  ].filter(Boolean);
  return topics.length ? topics.join(", ") : "career background, role context, and relationship next steps";
}

export async function processTranscript(input: unknown): Promise<TranscriptOutput> {
  const parsed = transcriptInputSchema.parse(input);
  if (!process.env.OPENAI_API_KEY) {
    return mockTranscriptProcessor(parsed.transcript, parsed.contactContext);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Extract finance networking CRM notes from a pasted transcript. Return strict JSON with summary, keyTopics, adviceGiven, personalHooks, firmInsights, recruitingInsights, followUpAngle, nextAction, suggestedFollowUpDate, relationshipWarmthAfter, and cleanNotes. Use enum values COLD, LUKEWARM, WARM, STRONG."
      },
      {
        role: "user",
        content: JSON.stringify({
          contactContext: parsed.contactContext,
          transcript: parsed.transcript
        })
      }
    ]
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return transcriptOutputSchema.parse(JSON.parse(content));
}

export function mockTranscriptProcessor(transcript: string, contactContext?: string): TranscriptOutput {
  const snippet = pickSnippet(transcript);
  const topics = inferTopics(transcript);
  const followUp = new Date();
  followUp.setDate(followUp.getDate() + 2);

  return {
    summary: `Discussed ${topics}. The conversation centered on practical relationship context and next steps for finance recruiting or long-term networking.`,
    keyTopics: topics,
    adviceGiven:
      "Prepare targeted questions, keep follow-ups concise, show specific interest in the group, and maintain periodic updates after the first call.",
    personalHooks:
      contactContext ? `Context referenced: ${contactContext}` : "Look for shared UChicago, credit investing, restructuring, or speaker-series angles.",
    firmInsights:
      "The firm context should be tracked for group focus, hiring rhythm, and where the contact sits in the coverage map.",
    recruitingInsights:
      "Follow up with a thank-you, note one specific takeaway, and reconnect with a short recruiting update after meaningful progress.",
    followUpAngle:
      "Send a thank-you referencing one specific point from the conversation and ask whether they would be open to staying in touch.",
    nextAction: "Send thank-you note and create a reconnect reminder.",
    suggestedFollowUpDate: followUp.toISOString(),
    relationshipWarmthAfter: transcript.toLowerCase().includes("happy to help") ? "WARM" : "LUKEWARM",
    cleanNotes: `Mock processed transcript excerpt: "${snippet}${transcript.length > 220 ? "..." : ""}"`,
    mockUsed: true
  };
}
