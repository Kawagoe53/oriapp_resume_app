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
        className={`max-w-[70%] rounded-lg p-3${
          role === "ASSISTANT" ? " bg-gray-200 " : " bg-blue-500 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
