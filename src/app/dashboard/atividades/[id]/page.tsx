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

interface RespostaAluno {
  id: string
  username: string
  resposta: string
  created_at: string
  nota?: string
  feedback?: string
}

export default function AtividadeRespostaPage() {
  const { user } = useAuth()
  const params = useParams()
  const atividadeId = params.id as string

  // Aluno states
  const [resposta, setResposta] = useState('')
  const [respostaSalva, setRespostaSalva] = useState<RespostaAluno | null>(null)
  
  // Professor states
  const [respostasAlunos, setRespostasAlunos] = useState<RespostaAluno[]>([])
  const [notasTemp, setNotasTemp] = useState<Record<string, { nota: string, feedback: string }>>({})

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const isProfessor = user?.role === 'professor'

  const atividade = atividades.find((a) => a.id === atividadeId)

  // Buscar dados no Supabase
  useEffect(() => {
    async function fetchDados() {
      if (!user) return

      if (isProfessor) {
        // Professor: busca todas as respostas dessa atividade
        const { data } = await supabase
          .from('respostas')
          .select('*')
          .eq('atividade_id', atividadeId)
          .order('created_at', { ascending: false })
        
        if (data) setRespostasAlunos(data)
      } else {
        // Aluno: busca apenas a sua resposta
        const { data } = await supabase
          .from('respostas')
          .select('*')
          .eq('atividade_id', atividadeId)
          .eq('username', user.username)
          .maybeSingle()

        if (data) {
          setRespostaSalva(data)
          setResposta(data.resposta)
        }
      }
      setCarregando(false)
    }
    fetchDados()
  }, [atividadeId, user, isProfessor])

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
    const { data, error } = await supabase.from('respostas').insert({
      atividade_id: atividadeId,
      username: user.username,
      resposta: resposta.trim(),
    }).select().single()

    if (error) {
      console.error('Erro ao salvar resposta:', error)
      alert('Erro ao enviar resposta. Tente novamente.')
      setEnviando(false)
      return
    }

    setRespostaSalva(data)
    setEnviando(false)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 4000)
  }

  const handleCorrigir = async (respostaId: string) => {
    const avaliacao = notasTemp[respostaId]
    if (!avaliacao?.nota) return

    setEnviando(true)

    const { error } = await supabase
      .from('respostas')
      .update({
        nota: avaliacao.nota,
        feedback: avaliacao.feedback || null,
      })
      .eq('id', respostaId)

    if (error) {
      console.error('Erro ao salvar correção:', error)
      alert('Erro ao enviar correção.')
    } else {
      // Atualizar lista local
      setRespostasAlunos(prev => 
        prev.map(r => r.id === respostaId ? { ...r, nota: avaliacao.nota, feedback: avaliacao.feedback } : r)
      )
      setEnviado(true)
      setTimeout(() => setEnviado(false), 4000)
    }
    
    setEnviando(false)
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
              <p className="text-sm font-medium text-success">{isProfessor ? 'Correção enviada!' : 'Resposta enviada!'}</p>
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
          {!isProfessor && respostaSalva && (
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

      {isProfessor ? (
        /* ========================================= */
        /* VISÃO DO PROFESSOR: Lista de respostas    */
        /* ========================================= */
        <div className="space-y-4 animate-fade-in-up animation-delay-300" style={{ animationFillMode: 'backwards' }}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Respostas dos Alunos</h2>
          
          {respostasAlunos.length === 0 ? (
            <div className="glass-card p-12 text-center text-text-muted">
              Nenhum aluno respondeu a esta atividade ainda.
            </div>
          ) : (
            respostasAlunos.map((resp) => {
              const avaliacaoTemp = notasTemp[resp.id] || { nota: resp.nota || '', feedback: resp.feedback || '' }
              
              return (
                <div key={resp.id} className="glass-card p-6 lg:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-surface-500/30 pb-4">
                    <div>
                      <h3 className="font-semibold text-text-primary text-lg">{resp.username}</h3>
                      <p className="text-xs text-text-muted">Enviado em {new Date(resp.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    {resp.nota && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success font-bold">
                        ⭐ Nota: {resp.nota}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-text-primary leading-relaxed bg-surface-800 p-4 rounded-xl">
                    {resp.resposta}
                  </div>

                  <div className="bg-surface-900/50 p-4 rounded-xl space-y-3 mt-4 border border-surface-500/30">
                    <h4 className="text-sm font-medium text-brand-300 flex items-center gap-2">
                      <CheckIcon className="w-4 h-4" /> Avaliação do Professor
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <label className="block text-xs text-text-muted mb-1">Nota</label>
                        <input 
                          type="text" 
                          placeholder="Ex: 10, A, etc"
                          className="input-focus w-full px-3 py-2 text-sm rounded-lg text-text-primary placeholder:text-text-muted/50"
                          value={avaliacaoTemp.nota}
                          onChange={(e) => setNotasTemp({ ...notasTemp, [resp.id]: { ...avaliacaoTemp, nota: e.target.value }})}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-3">
                        <label className="block text-xs text-text-muted mb-1">Feedback (opcional)</label>
                        <input 
                          type="text"
                          placeholder="Muito bem! Excelente compreensão..." 
                          className="input-focus w-full px-3 py-2 text-sm rounded-lg text-text-primary placeholder:text-text-muted/50"
                          value={avaliacaoTemp.feedback}
                          onChange={(e) => setNotasTemp({ ...notasTemp, [resp.id]: { ...avaliacaoTemp, feedback: e.target.value }})}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCorrigir(resp.id)}
                      disabled={enviando || !avaliacaoTemp.nota}
                      className="btn-glow mt-2 w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                    >
                      {enviando ? 'Salvando...' : 'Salvar Avaliação'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* ========================================= */
        /* VISÃO DO ALUNO: Responder ou ver nota     */
        /* ========================================= */
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
                {respostaSalva && !respostaSalva.nota && (
                  <p className="text-xs text-success">✅ Resposta enviada ao professor</p>
                )}
              </div>
            </div>

            {respostaSalva?.nota && (
              <div className="mt-6 bg-success/5 border border-success/20 rounded-xl p-5">
                <h3 className="font-semibold text-success flex items-center gap-2 mb-2">
                  <CheckIcon className="w-5 h-5" />
                  Atividade Corrigida!
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="inline-flex max-w-fit items-center px-3 py-1 rounded-full bg-success/20 text-success font-bold">
                    ⭐ Nota: {respostaSalva.nota}
                  </div>
                  {respostaSalva.feedback && (
                    <p className="text-sm text-text-secondary mt-2 border-l-2 border-success/30 pl-3">
                      <strong className="text-text-primary">Feedback do Professor:</strong><br/>
                      {respostaSalva.feedback}
                    </p>
                  )}
                </div>
              </div>
            )}

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
      )}

      {/* Tip */}
      {!isProfessor && !respostaSalva && (
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
