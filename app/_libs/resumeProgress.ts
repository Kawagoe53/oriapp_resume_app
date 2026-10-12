import { questions } from "../_constants/questions";

type Message = { role: string; stepNumber: number; content: unknown };

export function isResumeAnswered(messages: Message[]) {
  const answeredSteps = new Set(
    messages
      .filter(
        (message) =>
          message.role === "USER" &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      )
      .map((message) => message.stepNumber),
  );
  return questions.every((question) => answeredSteps.has(question.stepNumber));
}
//この関数は、チャット履歴を受け取り、必要な質問すべてに回答があるかを判定する関数
//実行順はfilter,map,new Set
//filter() は配列の各要素を調べる
//ユーザーの発言で、内容が文字列で、空白だけではないメッセージのstepNumberを取得
//mapでそのstepNumberだけの配列にする
//番号の配列を Set に変換します→Set は、同じ値を重複して持たない集合
