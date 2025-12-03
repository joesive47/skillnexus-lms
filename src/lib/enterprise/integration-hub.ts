export interface IntegrationConfig {
  type: 'hr' | 'crm' | 'erp' | 'sso' | 'webhook'
  name: string
  endpoint: string
  apiKey?: string
  credentials?: Record<string, string>
  settings?: Record<string, any>
}

export interface WebhookEvent {
  event: string
  data: any
  timestamp: Date
}

export class IntegrationHub {
  private integrations: Map<string, IntegrationConfig> = new Map()

  async registerIntegration(tenantId: string, config: IntegrationConfig) {
    const integrationId = `${tenantId}-${config.type}-${Date.now()}`
    this.integrations.set(integrationId, config)
    return integrationId
  }

  async syncHRData(tenantId: string, users: any[]) {
    const integration = this.findIntegration(tenantId, 'hr')
    if (!integration) return { success: false, error: 'HR integration not found' }

    return { success: true, synced: users.length }
  }

  async syncCRMData(tenantId: string, contacts: any[]) {
    const integration = this.findIntegration(tenantId, 'crm')
    if (!integration) return { success: false, error: 'CRM integration not found' }

    return { success: true, synced: contacts.length }
  }

  async sendWebhook(tenantId: string, event: WebhookEvent) {
    const webhooks = Array.from(this.integrations.values())
      .filter(i => i.type === 'webhook')

    for (const webhook of webhooks) {
      try {
        await fetch(webhook.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        })
      } catch (error) {
        console.error('Webhook failed:', error)
      }
    }
  }

  async configureSSOProvider(tenantId: string, provider: string, config: any) {
    const integrationId = await this.registerIntegration(tenantId, {
      type: 'sso',
      name: provider,
      endpoint: config.endpoint,
      credentials: config.credentials,
      settings: config.settings
    })
    return integrationId
  }

  private findIntegration(tenantId: string, type: string) {
    for (const [id, config] of this.integrations.entries()) {
      if (id.startsWith(tenantId) && config.type === type) {
        return config
      }
    }
    return null
  }
}

export const integrationHub = new IntegrationHub()
