import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const defaultRecipient = process.env.CONTACT_EMAIL;
const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

type SendMailOptions = {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
};

export async function sendMail({
  subject,
  text,
  replyTo,
  to = defaultRecipient,
}: SendMailOptions) {
  if (!resend || !to) throw new Error("Missing mail configuration");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    text,
  });
  if (error) throw new Error("Mail delivery failed");
}
