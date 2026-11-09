import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || "VIJOY POWER SOLUTION <notifications@vijoypowersolution.com>";

let transporter: nodemailer.Transporter | null = null;

if (smtpHost && smtpUser && smtpPass && smtpHost !== "smtp.example.com") {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  if (!transporter) {
    console.log(`[Email Mock Delivery] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ""),
      html,
    });
    return true;
  } catch (error) {
    console.error("[Email Delivery Error]", error);
    return false;
  }
}
