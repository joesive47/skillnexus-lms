import Link from 'next/link'

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  buttonText: string
  buttonColor: string
}

export function QuickActionCard({ 
  title, 
  description, 
  href, 
  icon, 
  buttonText, 
  buttonColor 
}: QuickActionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={href} className={`inline-flex items-center px-4 py-2 ${buttonColor} text-white rounded-lg hover:opacity-90 transition-opacity`}>
        {icon}
        {buttonText}
      </Link>
    </div>
  )
}