import { randomUUID } from "node:crypto";
import { parseArgs } from "node:util";
import nextEnv from "@next/env";
import pg from "pg";

// Use the same .env files and precedence as the local Next.js app.
nextEnv.loadEnvConfig(process.cwd(), true);

const { values } = parseArgs({
  options: {
    "user-id": { type: "string" },
    title: { type: "string", default: "動作確認用の履歴書" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

if (values.help) {
  console.log(`テスト履歴書1件・職歴3件・チャット2件を作成します。
使い方: npm run resume:create -- [--user-id <users.id>] [--title <タイトル>] [--dry-run]
ユーザーが1人の場合は --user-id を省略できます。
--dry-run は作成処理を検証してからロールバックします。
接続先: DIRECT_URL（未設定ならDATABASE_URL）。AI生成・利用回数の消費はありません。`);
} else {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DIRECT_URL または DATABASE_URL を設定してください。");
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10000 });
  let inTransaction = false;
  try {
    await client.connect();
    const users = values["user-id"]
      ? await client.query('SELECT id FROM users WHERE id = $1', [values["user-id"]])
      : await client.query('SELECT id FROM users ORDER BY created_at LIMIT 2');
    if (users.rows.length !== 1) {
      throw new Error("所有者を特定できません。--user-id に users テーブルの id を指定してください。");
    }

    const id = randomUUID();
    await client.query("BEGIN");
    inTransaction = true;
    await client.query(`INSERT INTO resumes
      (id, user_id, title, job_type, status, full_name, email, phone, address,
       summary, skills, certificate, visa_info, availability,
       education_school, education_major, education_year, created_at, updated_at)
      VALUES ($1, $2, $3, 'CAFE', 'COMPLETED', 'Sample Taro',
       'resume-test@example.com', '0400 000 000', 'Melbourne VIC',
       $4, $5::jsonb, $6::jsonb, 'Working Holiday Visa | Valid to Sep 2027',
       'Immediate start | Mon–Fri, 9 am–5 pm',
       'Sample University', 'Business Administration', 2022, NOW(), NOW())`,
    [id, users.rows[0].id, values.title,
      'Friendly hospitality professional experienced in cafe service, dining and retail. Reliable team member skilled in customer care, cash handling and workplace hygiene.',
      JSON.stringify(['Customer service', 'Cash handling', 'Teamwork', 'Conversational English']),
      JSON.stringify(['Driver licence'])]);

    const jobs = [
      ['Sample Cafe', 'Cafe All-rounder', '2024-04-01', '2025-03-31',
        ['Served food and drinks and handled payments.', 'Maintained clean, organised service areas.']],
      ['Sample Bistro', 'Food & Beverage Attendant', '2023-04-01', '2024-03-31',
        ['Welcomed guests and delivered table service.', 'Coordinated orders with the kitchen team.']],
      ['Sample Bakery', 'Retail Assistant', '2022-04-01', '2023-03-31',
        ['Assisted customers and replenished displays.', 'Processed payments and maintained store hygiene.']],
    ];
    for (const [company, position, start, end, description] of jobs) {
      await client.query(`INSERT INTO job_experiences
        (id, resume_id, company_name, position, job_type, start_date, end_date,
         description, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'Part-time', $5, $6, $7::jsonb, NOW(), NOW())`,
      [randomUUID(), id, company, position, start, end, JSON.stringify(description)]);
    }
    for (const [role, content] of [
      ['ASSISTANT', '氏名をカタカナでフルネームで教えてください。'],
      ['USER', 'サンプル タロウ（すべて動作確認用の架空情報です）'],
    ]) {
      await client.query(`INSERT INTO chat_messages
        (id, resume_id, role, content, step_number, created_at, updated_at)
        VALUES ($1, $2, $3, $4::jsonb, 1, NOW(), NOW())`,
      [randomUUID(), id, role, JSON.stringify(content)]);
    }
    await client.query(values["dry-run"] ? "ROLLBACK" : "COMMIT");
    inTransaction = false;
    console.log(values["dry-run"] ? "検証成功：履歴書1件・職歴3件・チャット2件。DBへの保存は取り消しました。" :
      `作成しました：${values.title}\nID: ${id}\nプレビュー: http://localhost:3000/resumes/${id}/preview`);
  } catch (error) {
    if (inTransaction) await client.query("ROLLBACK");
    console.error(error instanceof Error ? error.message : "履歴書の作成に失敗しました。");
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}
