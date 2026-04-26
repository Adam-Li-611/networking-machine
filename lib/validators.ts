import { z } from "zod";

const optionalString = z.string().trim().optional().transform((value) => value || undefined);

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  primaryEmail: optionalString,
  secondaryEmail: optionalString,
  phone: optionalString,
  linkedinUrl: optionalString,
  currentFirmId: optionalString,
  currentTitle: optionalString,
  currentGroup: optionalString,
  location: optionalString,
  timezone: optionalString,
  schoolOrAffiliation: optionalString,
  source: optionalString,
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  warmth: z.enum(["COLD", "LUKEWARM", "WARM", "STRONG"]),
  recruitingRelevance: z.enum(["LOW", "MEDIUM", "HIGH"]),
  relationshipStage: z.enum([
    "TARGET_IDENTIFIED",
    "OUTREACH_NEEDED",
    "INITIAL_OUTREACH_SENT",
    "FOLLOW_UP_NEEDED",
    "REPLIED",
    "CALL_SCHEDULED",
    "CALL_COMPLETED",
    "WARM_RELATIONSHIP",
    "STRONG_ADVOCATE",
    "DORMANT",
    "CLOSED_NO_RESPONSE",
    "DO_NOT_CONTACT"
  ]),
  personalHooks: optionalString,
  generalNotes: optionalString,
  tagIds: z.array(z.string()).default([])
});

export const firmSchema = z.object({
  name: z.string().trim().min(1),
  firmType: z.enum([
    "INVESTMENT_BANK",
    "RX_ADVISORY",
    "PRIVATE_CREDIT",
    "HEDGE_FUND",
    "SPECIAL_SITUATIONS",
    "PRIVATE_EQUITY",
    "ASSET_MANAGER",
    "LAW_FIRM",
    "RECRUITER",
    "UCHICAGO",
    "OTHER"
  ]),
  strategy: optionalString,
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  recruitingRelevance: z.enum(["LOW", "MEDIUM", "HIGH"]),
  coverageStrength: z.enum(["NONE", "WEAK", "MEDIUM", "STRONG"]),
  targetStatus: z.enum(["TARGET", "ACTIVE", "WATCHLIST", "DEPRIORITIZED", "CLOSED"]),
  website: optionalString,
  notes: optionalString
});

export const transcriptInputSchema = z.object({
  transcript: z.string().min(20),
  contactId: z.string().optional(),
  conversationId: z.string().optional(),
  contactContext: z.string().optional()
});

export const transcriptOutputSchema = z.object({
  summary: z.string(),
  keyTopics: z.string(),
  adviceGiven: z.string(),
  personalHooks: z.string(),
  firmInsights: z.string(),
  recruitingInsights: z.string(),
  followUpAngle: z.string(),
  nextAction: z.string(),
  suggestedFollowUpDate: z.string().optional(),
  relationshipWarmthAfter: z.enum(["COLD", "LUKEWARM", "WARM", "STRONG"]),
  cleanNotes: z.string(),
  mockUsed: z.boolean().optional()
});

export type TranscriptOutput = z.infer<typeof transcriptOutputSchema>;
