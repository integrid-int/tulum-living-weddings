type ContactNotificationPayload = {
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  guestCount?: number;
  budgetRange?: string;
  eventType?: string;
  message: string;
  sourcePage?: string;
};

export type ContactEmailResult = {
  provider: "webhook" | "log";
  delivered: boolean;
};

function buildNotificationBody(payload: ContactNotificationPayload) {
  const details = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone ?? "Not provided"}`,
    `Event Date: ${payload.eventDate ?? "Not provided"}`,
    `Guest Count: ${payload.guestCount ?? "Not provided"}`,
    `Budget Range: ${payload.budgetRange ?? "Not provided"}`,
    `Event Type: ${payload.eventType ?? "Not provided"}`,
    `Source Page: ${payload.sourcePage ?? "/contact"}`,
    "",
    "Message:",
    payload.message
  ];

  return details.join("\n");
}

export async function sendContactNotification(payload: ContactNotificationPayload): Promise<ContactEmailResult> {
  const to = process.env.CONTACT_NOTIFICATION_TO?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const webhookUrl = process.env.CONTACT_EMAIL_WEBHOOK_URL?.trim();
  const webhookToken = process.env.CONTACT_EMAIL_WEBHOOK_TOKEN?.trim();

  if (!to || !from) {
    return { provider: "log", delivered: false };
  }

  const subject = `New contact inquiry from ${payload.name}`;
  const body = buildNotificationBody(payload);

  if (!webhookUrl) {
    console.info("[contact-email] Notification prepared but no provider configured.", {
      to,
      from,
      subject
    });

    return { provider: "log", delivered: false };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(webhookToken ? { authorization: `Bearer ${webhookToken}` } : {})
    },
    body: JSON.stringify({
      to,
      from,
      replyTo: payload.email,
      subject,
      text: body
    })
  });

  if (!response.ok) {
    throw new Error(`Contact email webhook failed with status ${response.status}`);
  }

  return { provider: "webhook", delivered: true };
}
