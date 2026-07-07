'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { atividades } from '../page'

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
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

export default function AtividadeRespostaPage() {
  const { user } = useAuth()
  const params = useParams()
  const atividadeId = params.id as string

  const [resposta, setResposta] = useState('')
  const [respostaSalva, setRespostaSalva] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const atividade = atividades.find((a) => a.id === atividadeId)

  // Buscar resposta existente do Supabase
  useEffect(() => {
    async function fetchResposta() {
      if (!user) return
      const { data } = await supabase
        .from('respostas')
        .select('resposta')
        .eq('atividade_id', atividadeId)
        .eq('username', user.username)
        .maybeSingle()

      if (data) {
        setRespostaSalva(data.resposta)
        setResposta(data.resposta)
      }
      setCarregando(false)
    }
    fetchResposta()
  }, [atividadeId, user])

  if (!user) return null

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!atividade) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="glass-card p-12 text-center">
          <p className="text-text-muted text-lg mb-4">
            Atividade não encontrada, {user.displayName}. 😕
          </p>
          <Link
            href="/dashboard/atividades"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar para Atividades
          </Link>
        </div>
      </div>
    )
  }

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resposta.trim()) return

    setEnviando(true)

    // Salvar no Supabase
    const { error } = await supabase.from('respostas').insert({
      atividade_id: atividadeId,
      username: user.username,
      resposta: resposta.trim(),
    })

    if (error) {
      console.error('Erro ao salvar resposta:', error)
      alert('Erro ao enviar resposta. Tente novamente.')
      setEnviando(false)
      return
    }

    setRespostaSalva(resposta.trim())
    setEnviando(false)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 4000)
  }

  const contadorPalavras = resposta
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Success Toast */}
      {enviado && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-success/15 border border-success/25 backdrop-blur-xl shadow-lg">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-success">Resposta enviada!</p>
              <p className="text-xs text-success/70">Salva no banco de dados com sucesso.</p>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="animate-fade-in-up">
        <Link
          href="/dashboard/atividades"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-400 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar para Atividades
        </Link>
      </div>

      {/* Activity Header */}
      <div className="glass-card p-6 lg:p-8 animate-fade-in-up animation-delay-100" style={{ animationFillMode: 'backwards' }}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/15">
            {atividade.materia}
          </span>
          <span className="text-xs text-text-muted">📅 Entrega: {atividade.dataEntrega}</span>
          {respostaSalva && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
              ✅ Respondida
            </span>
          )}
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-text-primary">
          {atividade.titulo}
        </h1>
        <p className="mt-2 text-text-secondary text-sm leading-relaxed">
          {atividade.descricao}
        </p>
      </div>

      {/* Question Card */}
      <div className="glass-card p-6 lg:p-8 border-l-4 border-l-gold-500 animate-fade-in-up animation-delay-200" style={{ animationFillMode: 'backwards' }}>
        <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wide mb-3">
          Questão
        </h2>
        <p className="text-text-primary leading-relaxed">
          {atividade.questao}
        </p>
      </div>

      {/* Answer Form */}
      <div className="glass-card p-6 lg:p-8 animate-fade-in-up animation-delay-300" style={{ animationFillMode: 'backwards' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <SendIcon className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Sua Resposta</h2>
            <p className="text-xs text-text-muted">
              {respostaSalva
                ? `${user.displayName}, sua resposta já foi enviada. Você pode revisá-la abaixo.`
                : `${user.displayName}, escreva sua resposta com atenção e clique em enviar.`
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleEnviar} className="space-y-4" id="resposta-form">
          <div>
            <textarea
              id="resposta-texto"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              className="input-focus w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted resize-none"
              placeholder={`${user.displayName}, escreva sua resposta aqui...`}
              rows={8}
              required
              disabled={!!respostaSalva}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-text-muted">
                {contadorPalavras > 0 && (
                  <span className={contadorPalavras < 20 ? 'text-warning' : 'text-success'}>
                    {contadorPalavras} {contadorPalavras === 1 ? 'palavra' : 'palavras'}
                  </span>
                )}
              </p>
              {respostaSalva && (
                <p className="text-xs text-success">✅ Resposta salva no banco de dados</p>
              )}
            </div>
          </div>

          {!respostaSalva && (
            <button
              type="submit"
              disabled={enviando || !resposta.trim()}
              className="btn-glow px-6 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              id="enviar-resposta-button"
            >
              <span className="flex items-center gap-2">
                {enviando ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando resposta...
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4" />
                    Enviar Resposta
                  </>
                )}
              </span>
            </button>
          )}
        </form>
      </div>

      {/* Tip */}
      {!respostaSalva && (
        <div
          className="glass-card p-4 border-l-4 border-l-brand-500 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          <p className="text-sm text-text-secondary">
            💡 <strong className="text-brand-300">Dica:</strong>{' '}
            {user.displayName}, releia a questão com calma antes de responder. Uma boa resposta é clara, objetiva e demonstra compreensão do texto.
          </p>
        </div>
      )}
    </div>
  )
}
