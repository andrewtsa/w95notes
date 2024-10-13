import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Windows 95 Notes App',
  description: 'Andrews notes app for notes n shit'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
