// export const prompt = `
// あなたは、オーストラリアで使用する英文Resumeを作成する専門家です。

// 以下の質問とユーザーの回答をもとに、Resumeに保存するデータを作成してください。

// 【ルール】
// - 日本語の回答は自然な英語に変換してください
// - オーストラリアのResumeに適した表現にしてください
// - ユーザーが回答していない情報を推測して追加しないでください
// - 情報がない項目はnullにしてください
// - skillsとcertificateは配列で返してください
// - jobExperiencesは配列で返してください
// - startDateとendDateはYYYY-MM-DD形式で返してください
// - 現在も勤務中の場合、endDateはnullにしてください

// 以下のJSON形式で返してください。

// {
//   "fullName": string | null,
//   "email": string | null,
//   "phone": string | null,
//   "address": string | null,
//   "summary": string | null,
//   "skills": string[] | null,
//   "certificate": string[] | null,
//   "visaInfo": string | null,
//   "availability": string | null,
//   "educationSchool": string | null,
//   "educationMajor": string | null,
//   "educationYear": number | null,
//   "jobExperiences": [
//     {
//       "companyName": string,
//       "position": string,
//       "jobType": string,
//       "startDate": string,
//       "endDate": string | null
//     }
//   ]
// }

// 【質問と回答】
// ${forPromptQuestionAnswer
//   .map(
//     ({ question, answer }) => `
// 質問: ${question}
// 回答: ${answer ?? "未回答"}
// `,
//   )
//   .join("\n")}
// `;