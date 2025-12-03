'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BiometricAuth } from '@/components/security/biometric-auth'

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)

  const enableTwoFactor = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/2fa/enable', { method: 'POST' })
      const data = await res.json()
      setQrCode(data.qrCodeURL)
      setBackupCodes(data.backupCodes)
    } catch (error) {
      alert('Failed to enable 2FA')
    }
    setLoading(false)
  }

  const verifyTwoFactor = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode })
      })
      
      if (res.ok) {
        setTwoFactorEnabled(true)
        setQrCode('')
        alert('2FA enabled successfully!')
      } else {
        alert('Invalid code')
      }
    } catch (error) {
      alert('Verification failed')
    }
    setLoading(false)
  }

  const disableTwoFactor = async () => {
    const code = prompt('Enter 2FA code to disable:')
    if (!code) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      
      if (res.ok) {
        setTwoFactorEnabled(false)
        alert('2FA disabled')
      } else {
        alert('Invalid code')
      }
    } catch (error) {
      alert('Failed to disable 2FA')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔐 Security Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status</p>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge className={twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}
              </Badge>
            </div>

            {!twoFactorEnabled && !qrCode && (
              <Button onClick={enableTwoFactor} disabled={loading}>
                Enable 2FA
              </Button>
            )}

            {qrCode && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <p className="font-medium mb-2">1. Scan QR Code</p>
                  <img src={qrCode} alt="QR Code" className="border rounded" />
                  <p className="text-sm text-gray-600 mt-2">
                    Use Google Authenticator or Authy to scan this code
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">2. Backup Codes</p>
                  <div className="bg-gray-50 p-4 rounded grid grid-cols-2 gap-2 text-sm font-mono">
                    {backupCodes.map((code, i) => (
                      <div key={i}>{code}</div>
                    ))}
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Save these codes! You'll need them if you lose your device.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">3. Verify</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    <Button onClick={verifyTwoFactor} disabled={loading || verificationCode.length !== 6}>
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {twoFactorEnabled && (
              <Button variant="destructive" onClick={disableTwoFactor} disabled={loading}>
                Disable 2FA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password Strength</p>
                <p className="text-sm text-gray-600">Last changed: Never</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <BiometricAuth />
    </div>
  )
}
