'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  )
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const [entreguesCount, setEntreguesCount] = useState(0)
  const [redacoesCount, setRedacoesCount] = useState(0)
  const isProfessor = user?.role === 'professor'

  const totalAtividades = 1 // Atualizar conforme adicionar atividades
  const pendentesCount = Math.max(0, totalAtividades - entreguesCount)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      const [respostasRes, redacoesRes] = await Promise.all([
        supabase
          .from('respostas')
          .select('id', { count: 'exact', head: true })
          .eq('username', user.username),
        supabase
          .from('redacoes')
          .select('id', { count: 'exact', head: true })
          .eq('username', user.username),
      ])

      setEntreguesCount(respostasRes.count || 0)
      setRedacoesCount(redacoesRes.count || 0)
    }
    fetchStats()
  }, [user])

  const stats = [
    {
      label: 'Atividades Pendentes',
      value: String(pendentesCount),
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      href: '/dashboard/atividades',
    },
    {
      label: 'Atividades Entregues',
      value: String(entreguesCount),
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      href: '/dashboard/atividades',
    },
    {
      label: 'Redações Enviadas',
      value: String(redacoesCount),
      icon: <PenIcon className="w-6 h-6" />,
      color: 'text-brand-400',
      bgColor: 'bg-brand-400/10',
      borderColor: 'border-brand-400/20',
      href: '/dashboard/redacoes',
    },
  ]

  const quickActions = [
    {
      title: 'Atividades',
      description: `${user.displayName}, veja suas tarefas pendentes e entregue suas atividades.`,
      href: '/dashboard/atividades',
      icon: <ClipboardIcon className="w-7 h-7" />,
      gradient: 'from-brand-500/20 to-brand-700/10',
    },
    {
      title: 'Redações',
      description: `Aqui, ${user.displayName}, você pode enviar suas redações e acompanhar o progresso.`,
      href: '/dashboard/redacoes',
      icon: <PenIcon className="w-7 h-7" />,
      gradient: 'from-gold-500/20 to-gold-600/10',
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Banner */}
      <div className="glass-card p-6 lg:p-8 relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 p-8 flex flex-col items-center text-center justify-center min-h-[160px]">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
            Ei, {user.displayName}, seja bem-vindo de volta! 
            <SparklesIcon className="w-6 h-6 text-gold-400 animate-pulse" />
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto">
            Preparado para mais um dia de estudos? Confira suas atividades pendentes e continue sua jornada.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`glass-card p-5 opacity-0 animate-fade-in-up hover:-translate-y-1 transition-transform group`}
            style={{ animationDelay: `${index * 0.1 + 0.2}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={`glass-card p-6 group opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1 + 0.5}s`, animationFillMode: 'forwards' }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-brand-400 mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                {action.title}
                <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Giro da Copa */}
        {!isProfessor && (
          <div className="mt-8 rounded-2xl bg-surface-800 border border-[#009b3a]/30 overflow-hidden shadow-lg shadow-[#009b3a]/10 relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009b3a] via-[#fedf00] to-[#002776]"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[#009b3a]/10 text-[#009b3a] group-hover:scale-110 transition-transform">
                  <TrophyIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Giro da Copa 🏆</h2>
                  <p className="text-sm text-text-muted">Acompanhe os jogos ao vivo enquanto estuda!</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-surface-700 bg-surface-900 relative">
                {/* ScoreBat Iframe */}
                <iframe 
                  src="https://www.scorebat.com/embed/livescore/" 
                  frameBorder="0" 
                  width="100%" 
                  height="600" 
                  allowFullScreen 
                  allow="autoplay; fullscreen" 
                  style={{width: '100%', height: '600px', overflow: 'hidden', display: 'block'}} 
                  className="_scorebatEmbeddedPlayer_"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tip Card */}
      <div
        className="glass-card p-4 border-l-4 border-l-gold-500 opacity-0 animate-fade-in-up flex items-start gap-3"
        style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
      >
        <LightbulbIcon className="w-5 h-5 text-gold-500 mt-0.5 shrink-0" />
        <p className="text-sm text-text-secondary">
          <strong className="text-gold-400">Dica do Professor:</strong>{' '}
          Para melhorar seu desempenho, tente revisar o conteúdo da aula logo após as atividades. A constância é a chave do sucesso.
        </p>
      </div>
    </div>
  )
}
