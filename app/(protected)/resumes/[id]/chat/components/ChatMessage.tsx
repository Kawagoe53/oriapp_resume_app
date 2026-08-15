type ChatMessageProps = {
  role: "ASSISTANT" | "USER";
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
        className={
          role === "ASSISTANT"
            ? "max-w-[70%] rounded-lg bg-gray-200 p-3"
            : "max-w-[70%] rounded-lg bg-blue-500 p-3 text-white"
        }
      >
        {content}
      </div>
    </div>
  );
}
