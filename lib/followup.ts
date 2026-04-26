import {
  CampaignStatus,
  Priority,
  RelationshipStage,
  TaskType,
  TouchType,
  Warmth
} from "@prisma/client";

export function addBusinessDays(start: Date, businessDays: number) {
  const date = new Date(start);
  let added = 0;
  while (added < businessDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
}

export function suggestedTaskForTouch(touchType: TouchType, occurredAt: Date) {
  if (touchType === "INITIAL_OUTREACH") {
    return {
      title: "Send follow-up 1",
      dueDate: addBusinessDays(occurredAt, 5),
      taskType: "SEND_FOLLOW_UP" as TaskType,
      nextStatus: "FOLLOW_UP_1_DUE" as CampaignStatus
    };
  }
  if (touchType === "FOLLOW_UP_1") {
    return {
      title: "Send follow-up 2",
      dueDate: addBusinessDays(occurredAt, 8),
      taskType: "SEND_FOLLOW_UP" as TaskType,
      nextStatus: "FOLLOW_UP_2_DUE" as CampaignStatus
    };
  }
  if (touchType === "FOLLOW_UP_2") {
    return {
      title: "Close as no response if no reply",
      dueDate: addBusinessDays(occurredAt, 7),
      taskType: "UPDATE_NOTES" as TaskType,
      nextStatus: "FOLLOW_UP_2_SENT" as CampaignStatus
    };
  }
  return null;
}

export function reconnectDateForWarmth(warmth: Warmth, happenedAt: Date) {
  if (warmth === "WARM") {
    const date = new Date(happenedAt);
    date.setDate(date.getDate() + 45);
    return date;
  }
  if (warmth === "STRONG") {
    const date = new Date(happenedAt);
    date.setDate(date.getDate() + 60);
    return date;
  }
  return null;
}

export function staleTouchCutoff(priority: Priority) {
  const days = priority === "HIGH" ? 30 : priority === "MEDIUM" ? 60 : 90;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function relationshipStageForTouch(touchType: TouchType) {
  if (touchType === "INITIAL_OUTREACH") return "INITIAL_OUTREACH_SENT" as RelationshipStage;
  if (touchType === "FOLLOW_UP_1" || touchType === "FOLLOW_UP_2") {
    return "FOLLOW_UP_NEEDED" as RelationshipStage;
  }
  return undefined;
}
