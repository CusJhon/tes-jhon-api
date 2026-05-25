import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Suspense } from 'react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'API Tools Hub | Professional API Generator Platform',
  description: 'Generate fake GoPay, Dana, Call, Instagram, Nokia Quote, and Reminder images',
  keywords: 'API, fake generator, GoPay, Dana, Instagram, image generator, REST API',
  authors: [{ name: 'API Tools Hub' }],
  openGraph: {
    title: 'API Tools Hub - Professional API Generator Platform',
    description: 'Generate fake images for GoPay, Dana, Instagram, and more',
    type: 'website',
    locale: 'en_US',
    siteName: 'API Tools Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Tools Hub',
    description: 'Professional API Generator Platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}