import "./globals.css"
import { Providers } from "@/components/providers"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillNexus - AI-Powered Learning Management System',
  description: 'แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร พร้อมเทคโนโลยี Anti-Skip และระบบรักษาความปลอดภัยระดับ Enterprise',
  keywords: 'LMS, AI Learning, SkillNexus, การเรียนรู้ออนไลน์, ทดสอบทักษะ, ใบรับรอง, Enterprise Learning',
  authors: [{ name: 'SkillNexus Team' }],
  creator: 'SkillNexus',
  publisher: 'SkillNexus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://skillnexus.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SkillNexus - AI-Powered Learning Management System',
    description: 'แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร',
    url: 'https://skillnexus.vercel.app',
    siteName: 'SkillNexus',
    images: [
      {
        url: '/logoupPowerskill.png',
        width: 1200,
        height: 630,
        alt: 'SkillNexus LMS Platform',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillNexus - AI-Powered Learning Management System',
    description: 'แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร',
    images: ['/logoupPowerskill.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logoupPowerskill.png" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}