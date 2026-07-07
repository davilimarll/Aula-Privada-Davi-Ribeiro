import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Portal do Professor Davi Ribeiro | Aula Privada',
  description:
    'Plataforma de ensino personalizada do Professor Davi Ribeiro. Acesse suas atividades, envie redações e acompanhe seu progresso.',
  keywords: ['ensino', 'professor', 'davi ribeiro', 'aula privada', 'educação'],
  authors: [{ name: 'Professor Davi Ribeiro' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
