'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Atividade {
  id: string
  titulo: string
  descricao: string
  dataEntrega: string
  materia: string
  questao: string
  alternativas?: string[]
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
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

/**
 * Lista de atividades.
 * 
 * Para adicionar uma nova atividade, basta adicionar um objeto
 * ao array abaixo com: id único, título, descrição, data de entrega,
 * matéria e questão.
 * 
 * Quando migrar para Supabase completo, substitua este array
 * por uma query à tabela `atividades`.
 */
export const atividades: Atividade[] = [
  {
    id: 'ativ-001',
    titulo: 'Interpretação de Texto — Crônica de Machado de Assis',
    descricao: 'Leia o trecho da crônica de Machado de Assis e responda à questão interpretativa.',
    dataEntrega: '14/07/2026',
    materia: 'Língua Portuguesa',
    questao: 'No trecho "O tempo é um tecido invisível em que se pode bordar tudo, uma flor, um pássaro, uma dama, um castelo, um túmulo", Machado de Assis utiliza uma figura de linguagem para representar o tempo. Identifique essa figura de linguagem e explique, com suas palavras, o que o autor quis dizer com essa construção.',
  },
]

export default function AtividadesPage() {
  const { user } = useAuth()
  const [respostasIds, setRespostasIds] = useState<Set<string>>(new Set())
  const [carregando, setCarregando] = useState(true)

  // Buscar quais atividades já foram respondidas no Supabase
  useEffect(() => {
    async function fetchRespostas() {
      if (!user) return
      const { data } = await supabase
        .from('respostas')
        .select('atividade_id')
        .eq('username', user.username)

      if (data) {
        setRespostasIds(new Set(data.map((r) => r.atividade_id)))
      }
      setCarregando(false)
    }
    fetchRespostas()
  }, [user])

  if (!user) return null

  const pendentes = atividades.filter((a) => !respostasIds.has(a.id)).length
  const entregues = atividades.filter((a) => respostasIds.has(a.id)).length

  const isProfessor = user.role === 'professor'

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-text-primary">Atividades</h1>
        <p className="mt-1 text-text-secondary">
          {isProfessor 
            ? `${user.displayName}, aqui estão as atividades da sua turma. Acompanhe as respostas dos alunos! 👨‍🏫`
            : `${user.displayName}, aqui estão suas atividades. Clique em "Fazer Atividade" para responder! 📋`
          }
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-3 animate-fade-in-up animation-delay-100" style={{ animationFillMode: 'backwards' }}>
        {isProfessor ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <ClipboardIcon className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-brand-400">{atividades.length} atividade{atividades.length !== 1 ? 's' : ''} criadas</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 border border-warning/20">
              <ClockIcon className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">{pendentes} pendente{pendentes !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
              <CheckCircleIcon className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">{entregues} entregue{entregues !== 1 ? 's' : ''}</span>
            </div>
          </>
        )}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {carregando ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <svg className="animate-spin w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : atividades.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-text-muted text-lg">
              Nenhuma atividade disponível no momento, {user.displayName}. Volte em breve! 📚
            </p>
          </div>
        ) : (
          atividades.map((atividade, index) => {
            const respondida = respostasIds.has(atividade.id)
            return (
              <div
                key={atividade.id}
                className="glass-card p-5 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.08 + 0.3}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {respondida ? (
                      <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-warning" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-text-primary">
                        {atividade.titulo}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/15">
                        {atividade.materia}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {atividade.descricao}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                      <span>📅 Entrega: {atividade.dataEntrega}</span>
                      {!isProfessor && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                            respondida
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {respondida ? '✅ Entregue' : '⏳ Pendente'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/dashboard/atividades/${atividade.id}`}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isProfessor || !respondida
                        ? 'bg-brand-500/15 text-brand-400 hover:bg-brand-500/25'
                        : 'bg-success/10 text-success hover:bg-success/20'
                    }`}
                    id={`atividade-${atividade.id}`}
                  >
                    {isProfessor ? (
                      <>
                        Ver Respostas dos Alunos
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    ) : respondida ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Ver Resposta
                      </>
                    ) : (
                      <>
                        Fazer Atividade
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Help Tip */}
      <div
        className="glass-card p-4 border-l-4 border-l-brand-500 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
      >
        <p className="text-sm text-text-secondary">
          {isProfessor ? (
            <>📌 <strong className="text-brand-300">Prof. {user.displayName}</strong>, clique em &quot;Ver Respostas dos Alunos&quot; para corrigir as atividades enviadas.</>
          ) : (
            <>📌 <strong className="text-brand-300">{user.displayName}</strong>, clique em &quot;Fazer Atividade&quot; para abrir a questão e enviar sua resposta. Depois de enviar, você pode revisá-la clicando em &quot;Ver Resposta&quot;.</>
          )}
        </p>
      </div>
    </div>
  )
}
