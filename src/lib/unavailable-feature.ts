import { NextResponse } from 'next/server'

// No environment bypass: re-enable only after replacing the incomplete implementation.
export function unavailableFeature() {
  return NextResponse.json({ error: 'This feature is temporarily unavailable pending implementation and security verification' }, { status: 503 })
}

export function removedMaintenanceEndpoint() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
