import nodemailer from "nodemailer";

function mailConfigured() {
  return Boolean(process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASS?.trim());
}

function createTransport() {
  const host = process.env.EMAIL_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT ?? "465");
  // Gmail app passwords are often copied with spaces; SMTP expects 16 chars without spaces.
  const user = process.env.EMAIL_USER?.trim() ?? "";
  const pass = (process.env.EMAIL_PASS ?? "").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendInviteEmail({
  to,
  courseTitle,
  joinUrl,
}: {
  to: string;
  courseTitle: string;
  joinUrl: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!mailConfigured()) {
    return { sent: false, error: "Email credentials are not configured." };
  }

  try {
    const transport = createTransport();
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `You're invited to ${courseTitle} on Atlas`,
      text: [
        `You have been invited to join the course "${courseTitle}" on Atlas.`,
        "",
        `Open this link to create your student account and join:`,
        joinUrl,
        "",
        "If you did not expect this email, you can ignore it.",
      ].join("\n"),
      html: `
        <p>You have been invited to join the course <strong>${courseTitle}</strong> on Atlas.</p>
        <p><a href="${joinUrl}">Create your account and join the course</a></p>
        <p style="color:#5b6878;font-size:13px;">If you did not expect this email, you can ignore it.</p>
      `,
    });
    return { sent: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to send email.";
    console.error("[mail]", message);
    return { sent: false, error: message };
  }
}
