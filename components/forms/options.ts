export const priorityOptions = ["LOW", "MEDIUM", "HIGH"] as const;
export const warmthOptions = ["COLD", "LUKEWARM", "WARM", "STRONG"] as const;
export const relevanceOptions = ["LOW", "MEDIUM", "HIGH"] as const;
export const relationshipStageOptions = [
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
] as const;
export const firmTypeOptions = [
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
] as const;
export const coverageOptions = ["NONE", "WEAK", "MEDIUM", "STRONG"] as const;
export const targetStatusOptions = ["TARGET", "ACTIVE", "WATCHLIST", "DEPRIORITIZED", "CLOSED"] as const;
export const conversationTypeOptions = [
  "COFFEE_CHAT",
  "PHONE_CALL",
  "ZOOM_CALL",
  "IN_PERSON_MEETING",
  "UCG_SPEAKER_CONVERSATION",
  "RECRUITING_CALL",
  "INFORMAL_EVENT_CONVERSATION",
  "EMAIL_ONLY_INTERACTION",
  "OTHER"
] as const;
export const mediumOptions = ["EMAIL", "PHONE", "ZOOM", "GOOGLE_MEET", "IN_PERSON", "LINKEDIN", "TEXT", "OTHER"] as const;
export const campaignTypeOptions = [
  "COLD_NETWORKING",
  "WARM_INTRO",
  "SPEAKER_OUTREACH",
  "RECRUITING_FOLLOW_UP",
  "POST_CALL_THANK_YOU",
  "LONG_TERM_RELATIONSHIP_MAINTENANCE",
  "REFERRAL_REQUEST",
  "EVENT_FOLLOW_UP",
  "OTHER"
] as const;
export const campaignStatusOptions = [
  "NOT_STARTED",
  "INITIAL_OUTREACH_SENT",
  "FOLLOW_UP_1_DUE",
  "FOLLOW_UP_1_SENT",
  "FOLLOW_UP_2_DUE",
  "FOLLOW_UP_2_SENT",
  "REPLIED",
  "CALL_SCHEDULED",
  "CALL_COMPLETED",
  "CONVERTED_TO_RELATIONSHIP",
  "PAUSED",
  "CLOSED_NO_RESPONSE",
  "DO_NOT_CONTACT"
] as const;
export const touchTypeOptions = [
  "INITIAL_OUTREACH",
  "FOLLOW_UP_1",
  "FOLLOW_UP_2",
  "THANK_YOU",
  "SCHEDULING_REPLY",
  "RESCHEDULE",
  "POST_CALL_FOLLOW_UP",
  "LONG_TERM_CHECK_IN",
  "RECRUITING_UPDATE",
  "REFERRAL_ASK",
  "SPEAKER_INVITATION",
  "OTHER"
] as const;
export const channelOptions = ["EMAIL", "LINKEDIN", "TEXT", "PHONE", "IN_PERSON", "OTHER"] as const;
export const directionOptions = ["OUTBOUND", "INBOUND"] as const;
export const touchStatusOptions = ["DRAFTED", "SENT", "RECEIVED", "NEEDS_REPLY", "NO_REPLY", "ARCHIVED"] as const;
export const taskTypeOptions = [
  "SEND_INITIAL_OUTREACH",
  "SEND_FOLLOW_UP",
  "SEND_THANK_YOU",
  "SCHEDULE_CALL",
  "PREPARE_FOR_CALL",
  "UPDATE_NOTES",
  "RECONNECT_LATER",
  "ASK_FOR_INTRO",
  "SEND_RESOURCE",
  "NO_ACTION_NEEDED",
  "OTHER"
] as const;
export const taskStatusOptions = ["OPEN", "SNOOZED", "DONE", "CANCELLED"] as const;
