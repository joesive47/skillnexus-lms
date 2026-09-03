import "./globals.css"
import { Providers } from "@/components/providers"
import GlobalWidgets from "@/components/global-widgets"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'upPowerSkill - AI-Powered Learning Management System',
  description: 'แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร พร้อมเทคโนโลยี Anti-Skip และระบบรักษาความปลอดภัยระดับ Enterprise',
  keywords: 'LMS, AI Learning, upPowerSkill, การเรียนรู้ออนไลน์, ทดสอบทักษะ, ใบรับรอง, Enterprise Learning',
  authors: [{ name: 'upPowerSkill Team' }],
  creator: 'upPowerSkill',
  publisher: 'upPowerSkill',
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
    title: 'upPowerSkill - AI-Powered Learning Management System',
    description: 'แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร',
    url: 'https://skillnexus.vercel.app',
    siteName: 'upPowerSkill',
    images: [
      {
        url: '/logoupPowerskill.png',
        width: 1200,
        height: 630,
        alt: 'upPowerSkill LMS Platform',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'upPowerSkill - AI-Powered Learning Management System',
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
          <GlobalWidgets />
        </Providers>
      </body>
    </html>
  )
}