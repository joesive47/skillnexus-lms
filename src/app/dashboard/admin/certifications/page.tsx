import { redirect } from 'next/navigation'

// This legacy path used a static demonstration UI. Route it to the
// database-backed certification and badge manager instead.
export default function CertificationsRedirectPage() {
  redirect('/admin/certifications')
}
