'use client'

import { useEffect, useState } from 'react'

export function CSRFToken() {
  const [token, setToken] = useState('')

  useEffect(() => {
    fetch('/api/security/csrf')
      .then(res => res.json())
      .then(data => setToken(data.token))
  }, [])

  return <input type="hidden" name="csrf_token" value={token} />
}
