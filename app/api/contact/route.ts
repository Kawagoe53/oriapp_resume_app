import { prisma } from "@/app/_libs/prisma";
import { contactSchema, contactTypeLabels } from "@/app/_schemas/contactSchema";
import { sendMail } from "@/app/_libs/resend";

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
    await sendMail({
      replyTo: email,
      subject: `【rireki お問い合わせ】${subject}`,
      text: `受付ID: ${contactId}\n名前: ${name}\nメールアドレス: ${email}\n種類: ${contactTypeLabels[type]}\n題名: ${subject}\n\n${content}`,
    });
  } catch {
    // 保存済みのため受付成功を返し、通知失敗はログに残す。
    console.error("Contact notification failed", { contactId });
  }

  return Response.json(
    { message: "お問い合わせを受け付けました。" },
    { status: 201 },
  );
}
