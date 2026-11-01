import { ChatRole } from "@/app/generated/prisma/enums";

type ChatMessageProps = {
  role: ChatRole;
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={
        role === "ASSISTANT" ? "flex justify-start" : "flex justify-end"
      }
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg p-4 text-sm leading-7 sm:max-w-[70%]${
          role === "ASSISTANT" ? " rk-chat-assistant " : " rk-chat-user"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
