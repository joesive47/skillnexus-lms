'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plug, Plus, CheckCircle } from 'lucide-react'

export default function IntegrationsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({
    type: 'hr',
    name: '',
    endpoint: '',
    apiKey: ''
  })

  const handleAdd = async () => {
    await fetch('/api/enterprise/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: 'default',
        config: formData
      })
    })
    setShowAdd(false)
    setFormData({ type: 'hr', name: '', endpoint: '', apiKey: '' })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Integration Hub</h1>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full p-2 border rounded"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="hr">HR System</option>
              <option value="crm">CRM</option>
              <option value="erp">ERP</option>
              <option value="sso">SSO Provider</option>
              <option value="webhook">Webhook</option>
            </select>
            <Input
              placeholder="Integration Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="API Endpoint"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
            />
            <Input
              placeholder="API Key"
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            />
            <Button onClick={handleAdd} className="w-full">Add Integration</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Workday HR', type: 'hr', status: 'active', lastSync: '2 hours ago' },
          { name: 'Salesforce CRM', type: 'crm', status: 'active', lastSync: '1 day ago' },
          { name: 'Okta SSO', type: 'sso', status: 'active', lastSync: 'Real-time' },
          { name: 'SAP ERP', type: 'erp', status: 'inactive', lastSync: 'Never' }
        ].map((integration, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plug className="h-5 w-5" />
                  {integration.name}
                </span>
                <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                  {integration.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Type:</span> {integration.type.toUpperCase()}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Last Sync:</span> {integration.lastSync}
                </div>
                {integration.status === 'active' && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Connected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
