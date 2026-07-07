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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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
    },
    {
      label: 'Atividades Entregues',
      value: String(entreguesCount),
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      label: 'Redações Enviadas',
      value: String(redacoesCount),
      icon: <PenIcon className="w-6 h-6" />,
      color: 'text-brand-400',
      bgColor: 'bg-brand-400/10',
      borderColor: 'border-brand-400/20',
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
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
            Ei, {user.displayName}, seja bem-vindo de volta! 🎉
          </h1>
          <p className="mt-2 text-text-secondary leading-relaxed max-w-xl">
            Que bom ter você aqui. Confira suas atividades pendentes e continue seu aprendizado.
            Estamos juntos nessa jornada!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`glass-card p-5 opacity-0 animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1 + 0.2}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
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
      </div>

      {/* Tip Card */}
      <div
        className="glass-card p-5 border-l-4 border-l-gold-500 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
      >
        <p className="text-sm text-text-secondary">
          💡 <strong className="text-gold-400">Dica do Professor:</strong>{' '}
          {user.displayName}, lembre-se de entregar suas atividades dentro do prazo. A organização é a chave para um bom desempenho!
        </p>
      </div>
    </div>
  )
}
