import type { ChatRole, ResumeStatus } from "@/app/generated/prisma/enums";

export type CreateChatMessageRequestBody = {
  content: string;
};

export type MessagesShowResponse = {
  isAnswered: boolean;
  status: ResumeStatus;
  chatMessages: {
    id: string;
    role: ChatRole;
    content: string;
    stepNumber: number;
  }[];
};
