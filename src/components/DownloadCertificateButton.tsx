import { Download } from 'lucide-react'
import Link from 'next/link'

interface Props {
  certificateNumber: string
  size?: 'sm' | 'default'
}

export function DownloadCertificateButton({ certificateNumber, size = 'default' }: Props) {
  if (size === 'sm') {
    return (
      <Link
        href={`/api/certificates/download/${certificateNumber}`}
        target="_blank"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
        title="Download PDF"
      >
        <Download className="h-4 w-4" />
      </Link>
    )
  }

  return (
    <Link
      href={`/api/certificates/download/${certificateNumber}`}
      target="_blank"
      className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </Link>
  )
}
