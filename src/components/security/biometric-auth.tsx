'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BiometricAuth() {
  const [supported, setSupported] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkSupport = () => {
    const isSupported = window.PublicKeyCredential !== undefined
    setSupported(isSupported)
    return isSupported
  }

  const registerBiometric = async () => {
    if (!checkSupport()) {
      alert('Biometric authentication not supported on this device')
      return
    }

    setLoading(true)
    try {
      const optionsRes = await fetch('/api/auth/webauthn/register', { method: 'POST' })
      const options = await optionsRes.json()

      // Convert challenge to Uint8Array
      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0))
      options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0))

      const credential = await navigator.credentials.create({
        publicKey: options
      })

      const verifyRes = await fetch('/api/auth/webauthn/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: {
            id: credential?.id,
            type: credential?.type,
            response: {}
          },
          challenge: options.challenge
        })
      })

      if (verifyRes.ok) {
        setRegistered(true)
        alert('Biometric authentication registered!')
      }
    } catch (error) {
      console.error('Biometric registration failed:', error)
      alert('Failed to register biometric authentication')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔐 Biometric Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Use fingerprint, Face ID, or Windows Hello to sign in
          </p>
          
          {!registered ? (
            <Button onClick={registerBiometric} disabled={loading}>
              {loading ? 'Registering...' : 'Enable Biometric Login'}
            </Button>
          ) : (
            <div className="text-green-600 font-medium">
              ✅ Biometric authentication enabled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
