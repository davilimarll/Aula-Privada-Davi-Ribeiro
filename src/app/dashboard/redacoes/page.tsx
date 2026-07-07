'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface Redacao {
  id: string
  titulo: string
  conteudo: string
  created_at: string
  status: 'enviada' | 'em_revisao' | 'corrigida'
  nota?: string | null
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}

export default function RedacoesPage() {
  const { user } = useAuth()
  const [redacoes, setRedacoes] = useState<Redacao[]>([])
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(true)

  // Buscar redações do Supabase
  useEffect(() => {
    async function fetchRedacoes() {
      if (!user) return
      const { data } = await supabase
        .from('redacoes')
        .select('*')
        .eq('username', user.username)
        .order('created_at', { ascending: false })

      if (data) {
        setRedacoes(data)
      }
      setCarregando(false)
    }
    fetchRedacoes()
  }, [user])

  if (!user) return null

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !conteudo.trim()) return

    setEnviando(true)

    const { data, error } = await supabase
      .from('redacoes')
      .insert({
        username: user.username,
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        status: 'enviada',
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar redação:', error)
      alert('Erro ao enviar redação. Tente novamente.')
      setEnviando(false)
      return
    }

    setRedacoes((prev) => [data, ...prev])
    setTitulo('')
    setConteudo('')
    setEnviando(false)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 4000)
  }

  const contadorPalavras = conteudo
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  const statusLabel = (status: Redacao['status']) => {
    switch (status) {
      case 'enviada':
        return { text: 'Enviada', color: 'text-brand-400', bg: 'bg-brand-400/10', border: 'border-brand-400/20' }
      case 'em_revisao':
        return { text: 'Em revisão', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' }
      case 'corrigida':
        return { text: 'Corrigida', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' }
    }
  }

  const formatarData = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-text-primary">Redações</h1>
        <p className="mt-1 text-text-secondary">
          {user.displayName}, aqui você pode enviar suas redações e acompanhar as correções. ✍️
        </p>
      </div>

      {/* Success Toast */}
      {enviado && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-success/15 border border-success/25 backdrop-blur-xl shadow-lg">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-success">Redação enviada!</p>
              <p className="text-xs text-success/70">Salva no banco de dados com sucesso.</p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      <div className="glass-card p-6 lg:p-8 animate-fade-in-up animation-delay-100" style={{ animationFillMode: 'backwards' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <SendIcon className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Nova Redação</h2>
            <p className="text-xs text-text-muted">
              {user.displayName}, faça assim para enviar sua redação: dê um título e cole ou digite seu texto abaixo.
            </p>
          </div>
        </div>

        <form onSubmit={handleEnviar} className="space-y-5" id="redacao-form">
          {/* Title Input */}
          <div>
            <label htmlFor="redacao-titulo" className="block text-sm font-medium text-text-secondary mb-2">
              Título da Redação
            </label>
            <input
              id="redacao-titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-focus w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted"
              placeholder="Ex: A importância da educação no século XXI"
              required
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="redacao-conteudo" className="block text-sm font-medium text-text-secondary mb-2">
              Texto da Redação
            </label>
            <textarea
              id="redacao-conteudo"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              className="input-focus w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted resize-none"
              placeholder={`${user.displayName}, cole ou digite sua redação aqui. Escreva com atenção e revise antes de enviar!`}
              rows={12}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-text-muted">
                {contadorPalavras > 0 && (
                  <span className={contadorPalavras < 100 ? 'text-warning' : 'text-success'}>
                    {contadorPalavras} {contadorPalavras === 1 ? 'palavra' : 'palavras'}
                  </span>
                )}
              </p>
              <p className="text-xs text-text-muted">
                Mínimo sugerido: 100 palavras
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={enviando || !titulo.trim() || !conteudo.trim()}
            className="btn-glow px-6 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            id="enviar-redacao-button"
          >
            <span className="flex items-center gap-2">
              {enviando ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando redação...
                </>
              ) : (
                <>
                  <SendIcon className="w-4 h-4" />
                  Enviar Redação
                </>
              )}
            </span>
          </button>
        </form>
      </div>

      {/* Previous Essays */}
      <div className="animate-fade-in-up animation-delay-300" style={{ animationFillMode: 'backwards' }}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Redações Anteriores
        </h2>

        {carregando ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <svg className="animate-spin w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : redacoes.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileTextIcon className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">
              {user.displayName}, você ainda não enviou nenhuma redação.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {redacoes.map((redacao, index) => {
              const status = statusLabel(redacao.status)
              return (
                <div
                  key={redacao.id}
                  className="glass-card p-5 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08 + 0.4}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="shrink-0">
                      <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                        <FileTextIcon className={`w-5 h-5 ${status.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-text-primary">
                          {redacao.titulo}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color} border ${status.border}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-2">
                        {redacao.conteudo}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                        <span>📅 Enviada em: {formatarData(redacao.created_at)}</span>
                        {redacao.nota && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                            ⭐ Nota: {redacao.nota}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Help Tip */}
      <div
        className="glass-card p-4 border-l-4 border-l-gold-500 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
      >
        <p className="text-sm text-text-secondary">
          💡 <strong className="text-gold-400">Dica:</strong>{' '}
          {user.displayName}, leia seu texto em voz alta antes de enviar. Isso ajuda a identificar erros e melhorar a fluidez da escrita!
        </p>
      </div>
    </div>
  )
}
