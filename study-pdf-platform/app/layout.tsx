import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyLens — AI Academic Reading Platform',
  description: 'Transform PDFs into interactive, intelligent study sessions powered by AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="mesh-bg min-h-screen font-body antialiased">
        {children}
      </body>
    </html>
  )
}
