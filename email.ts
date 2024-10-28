import { Context, Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { Resend } from "resend";

const app = new Hono();

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/email", async (c: Context) => {
  const { email, subject, to } = await c.req.json();

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html: email,
  });

  if (error) {
    return c.json({ error }, 500);
  }

  return c.json({ data }, 200);
});

export const emailHandler = handle(app);
