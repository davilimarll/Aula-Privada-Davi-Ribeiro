'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </svg>
  )
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m7 11 4-4 4 4 5-5" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <BookIcon className="w-7 h-7" />,
      title: 'Atividades Organizadas',
      description: 'Todas as suas tarefas em um só lugar, com acompanhamento de status em tempo real.',
    },
    {
      icon: <PenIcon className="w-7 h-7" />,
      title: 'Envio de Redações',
      description: 'Espaço dedicado para compor e enviar suas redações com feedback direto do professor.',
    },
    {
      icon: <ChartIcon className="w-7 h-7" />,
      title: 'Acompanhe seu Progresso',
      description: 'Visualize seu desempenho e evolução ao longo do tempo de forma clara e intuitiva.',
    },
    {
      icon: <ShieldIcon className="w-7 h-7" />,
      title: 'Ambiente Seguro',
      description: 'Plataforma privada e protegida para uma experiência de aprendizado focada.',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/3 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <BookIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">
            Prof. Davi Ribeiro
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-text-secondary hover:text-brand-400 transition-colors duration-300"
        >
          Entrar
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 md:pt-28 md:pb-32">
          <div
            className={`transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-700/80 border border-brand-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-xs font-medium text-brand-300">
                Portal de Ensino Privado
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl">
              <span className="text-text-primary">Aprenda com o </span>
              <span className="gradient-text">Professor{'\u00A0'}Davi{'\u00A0'}Ribeiro</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Uma plataforma exclusiva e personalizada para seus estudos.
              Atividades, redações e acompanhamento — tudo em um ambiente
              feito especialmente para você.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-glow text-lg px-8 py-4 rounded-xl" id="cta-acessar-portal">
                <span>Acessar Portal</span>
              </Link>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute top-32 left-12 hidden lg:block animate-float opacity-20">
            <div className="w-16 h-16 rounded-2xl border border-brand-500/30 rotate-12" />
          </div>
          <div className="absolute bottom-32 right-16 hidden lg:block animate-float opacity-20" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 rounded-xl border border-gold-500/30 -rotate-12" />
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 pb-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Tudo que você precisa, em um só lugar
            </h2>
            <p className="mt-3 text-text-secondary">
              Ferramentas pensadas para tornar seu aprendizado mais eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`glass-card p-6 opacity-0 ${
                  mounted ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-500/50 py-8 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} Professor Davi Ribeiro. Todos os direitos reservados.
            </p>
            <p className="text-sm text-text-muted">
              Plataforma de Ensino Privado
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
