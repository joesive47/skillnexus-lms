'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Plus } from 'lucide-react'

export default function RolesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as any[]
  })

  const handleCreate = async () => {
    await fetch('/api/enterprise/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        tenantId: 'default',
        ...formData
      })
    })
    setShowCreate(false)
    setFormData({ name: '', description: '', permissions: [] })
  }

  const addPermission = () => {
    setFormData({
      ...formData,
      permissions: [...formData.permissions, { resource: '', action: '' }]
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Role Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Permissions</label>
                <Button size="sm" variant="outline" onClick={addPermission}>
                  Add Permission
                </Button>
              </div>
              
              {formData.permissions.map((perm, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Resource (e.g., courses)"
                    value={perm.resource}
                    onChange={(e) => {
                      const newPerms = [...formData.permissions]
                      newPerms[i].resource = e.target.value
                      setFormData({ ...formData, permissions: newPerms })
                    }}
                  />
                  <Input
                    placeholder="Action (e.g., create)"
                    value={perm.action}
                    onChange={(e) => {
                      const newPerms = [...formData.permissions]
                      newPerms[i].action = e.target.value
                      setFormData({ ...formData, permissions: newPerms })
                    }}
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleCreate} className="w-full">Create Role</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Super Admin', permissions: 'All permissions', users: 2 },
          { name: 'Tenant Admin', permissions: 'Tenant management', users: 15 },
          { name: 'Course Manager', permissions: 'Course CRUD', users: 45 }
        ].map((role, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {role.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{role.permissions}</p>
              <p className="text-xs">{role.users} users assigned</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
