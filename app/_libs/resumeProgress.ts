import { questions } from "../_constants/questions";

type Message = { role: string; stepNumber: number; content: unknown };

export function isResumeAnswered(messages: Message[]) {
  const answeredSteps = new Set(messages.filter((message) =>
    message.role === "USER" && typeof message.content === "string" &&
    message.content.trim().length > 0,
  ).map((message) => message.stepNumber));
  return questions.length > 0 && questions.every((question) => answeredSteps.has(question.stepNumber));
}
