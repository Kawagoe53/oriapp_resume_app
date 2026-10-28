import { prisma } from "@/app/_libs/prisma";
import { contactSchema, contactTypeLabels } from "@/app/_schemas/contactSchema";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json(); //JSONとして読み取れないデータが来ると例外を投げるため、try-catchで囲む
  } catch {
    return Response.json(
      { message: "送信内容を確認してください。" },
      { status: 400 },
    );
  }
  const parsed = contactSchema.safeParse(body); //body が contactSchema のルールに合っているか検証
  if (!parsed.success) {
    //バリデーションに失敗しても例外を投げず、結果を返すのでif文で判定する
    return Response.json(
      {
        message: "入力内容を確認してください。",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  const { name, email, subject, content, type } = parsed.data;
  let contactId: string; //DB保存後にIDを代入
  try {
    const contact = await prisma.contact.create({
      data: { name, email, subject, content, type },
    });
    contactId = contact.id;
  } catch {
    console.error("Contact submission failed");
    return Response.json(
      { message: "送信できませんでした。時間をおいてもう一度お試しください。" },
      { status: 500 },
    );
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL;
    if (!apiKey || !recipient) throw new Error("Missing mail configuration"); //どちらか一方でも未設定なら例外を投げます。
    const resend = new Resend(apiKey); //APIキーを設定したツールを作る(準備)
    //Resendのライブラリが「クラスから new で作って使う」という設計
    const { error } = await resend.emails.send({
      //実際に送信を依頼する
      from: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
      to: recipient,
      replyTo: email,
      subject: `【rireki お問い合わせ】${subject}`,
      text: `受付ID: ${contactId}\n名前: ${name}\nメールアドレス: ${email}\n種類: ${contactTypeLabels[type]}\n題名: ${subject}\n\n${content}`,
    });
    if (error) throw new Error("Mail delivery failed");
  } catch {
    // 保存済みのため受付成功を返し、通知失敗はログに残す。
    console.error("Contact notification failed", { contactId });
  }

  return Response.json(
    { message: "お問い合わせを受け付けました。" },
    { status: 201 },
  );
}
