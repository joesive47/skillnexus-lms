import prisma from '@/lib/prisma'

export async function registerWebhook(data: {
  url: string
  events: string[]
  userId: string
  secret?: string
}) {
  return await prisma.webhook.create({
    data: {
      url: data.url,
      events: JSON.stringify(data.events),
      userId: data.userId,
      secret: data.secret || generateWebhookSecret(),
    }
  })
}

export async function triggerWebhook(event: string, payload: any) {
  const webhooks = await prisma.webhook.findMany({
    where: {
      isActive: true
    }
  }).then(hooks => hooks.filter(h => {
    const events = JSON.parse(h.events as string);
    return events.includes(event);
  }))
  
  for (const webhook of webhooks) {
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret || '',
          'X-Webhook-Event': event,
        },
        body: JSON.stringify(payload)
      })
      
      await prisma.webhook.update({
        where: { id: webhook.id },
        data: { lastTriggeredAt: new Date() }
      })
    } catch (error) {
      console.error(`Webhook failed: ${webhook.url}`, error)
    }
  }
}

function generateWebhookSecret() {
  return `whsec_${Math.random().toString(36).substring(2, 15)}`
}
