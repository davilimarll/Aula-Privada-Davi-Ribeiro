'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

const questoes = [
  {
    id: 1,
    tema: 'Números Inteiros',
    pergunta: 'Qual é o resultado da expressão: -15 + 3 × (-4) - (-10)?',
    opcoes: ['-17', '38', '-27', '2'],
    respostaCerta: 0 // índice
  },
  {
    id: 2,
    tema: 'Mínimo Múltiplo Comum',
    pergunta: 'Dois ônibus partem juntos do terminal. A linha A passa a cada 15 minutos e a linha B a cada 25 minutos. Daqui a quantos minutos eles partirão juntos novamente?',
    opcoes: ['50 min', '75 min', '100 min', '125 min'],
    respostaCerta: 1
  },
  {
    id: 3,
    tema: 'Porcentagem',
    pergunta: 'Um tênis que custava R$ 250,00 entrou em promoção com 20% de desconto. Qual é o preço do tênis com o desconto?',
    opcoes: ['R$ 230,00', 'R$ 210,00', 'R$ 200,00', 'R$ 180,00'],
    respostaCerta: 2
  },
  {
    id: 4,
    tema: 'Regra de Três Simples',
    pergunta: 'Se 4 pedreiros constroem um muro em 6 dias, em quantos dias 3 pedreiros construiriam o mesmo muro (trabalhando no mesmo ritmo)?',
    opcoes: ['4,5 dias', '6 dias', '8 dias', '10 dias'],
    respostaCerta: 2
  },
  {
    id: 5,
    tema: 'Média Aritmética',
    pergunta: 'As notas de um aluno durante os bimestres foram: 6.5, 7.0, 8.5 e 6.0. Qual foi a média anual?',
    opcoes: ['6.5', '7.0', '7.5', '8.0'],
    respostaCerta: 1
  },
  {
    id: 6,
    tema: 'Equação do 1º Grau',
    pergunta: 'O triplo de um número subtraído de 5 resulta em 16. Que número é esse?',
    opcoes: ['7', '6', '8', '9'],
    respostaCerta: 0
  },
  {
    id: 7,
    tema: 'Sistema de Equações',
    pergunta: 'Em um estacionamento há carros e motos, totalizando 12 veículos e 38 rodas. Quantos carros e quantas motos há no estacionamento?',
    opcoes: ['5 carros e 7 motos', '6 carros e 6 motos', '7 carros e 5 motos', '8 carros e 4 motos'],
    respostaCerta: 2
  },
  {
    id: 8,
    tema: 'Sistema Métrico',
    pergunta: 'Quantos litros de água cabem em uma caixa d\'água em formato de cubo com 1 metro de aresta? (Lembrando que 1 m³ = 1000 L)',
    opcoes: ['100 L', '1000 L', '10 L', '10.000 L'],
    respostaCerta: 1
  },
  {
    id: 9,
    tema: 'Geometria (Pitágoras)',
    pergunta: 'Uma escada de 5 metros está apoiada em um muro. A base da escada está a 3 metros de distância do muro. Em qual altura a escada toca o muro?',
    opcoes: ['2 metros', '3 metros', '4 metros', '5 metros'],
    respostaCerta: 2
  },
  {
    id: 10,
    tema: 'Raciocínio Lógico',
    pergunta: 'Observe a sequência: 2, 5, 10, 17, 26, ... Qual é o próximo número?',
    opcoes: ['35', '37', '39', '41'],
    respostaCerta: 1
  }
]

interface NivelamentoResult {
  username: string;
  displayName: string;
  score: number;
  total: number;
  date: string;
}

export default function NivelamentoPage() {
  const { user } = useAuth()
  
  // Quiz states
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [previousResult, setPreviousResult] = useState<NivelamentoResult | null>(null)

  // Professor states
  const [alunosResults, setAlunosResults] = useState<NivelamentoResult[]>([])

  useEffect(() => {
    if (!user) return

    if (user.role === 'aluno') {
      const saved = localStorage.getItem(`aula-privada-nivelamento-${user.username}`)
      if (saved) {
        setPreviousResult(JSON.parse(saved))
        setFinished(true)
      }
    } else {
      // Professor: buscar resultados
      const results: NivelamentoResult[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('aula-privada-nivelamento-')) {
          results.push(JSON.parse(localStorage.getItem(key) || '{}'))
        }
      }
      setAlunosResults(results)
    }
  }, [user])

  if (!user) return null

  const isProfessor = user.role === 'professor'

  // Fluxo do Professor
  if (isProfessor) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <TargetIcon className="w-6 h-6 text-brand-400" /> Nivelamento
          </h1>
          <p className="mt-1 text-text-secondary">
            {user.displayName}, acompanhe o resultado da avaliação diagnóstica dos seus alunos.
          </p>
        </div>

        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Resultados Recentes</h2>
          
          {alunosResults.length === 0 ? (
            <p className="text-text-muted text-center py-8">Nenhum aluno realizou o nivelamento ainda.</p>
          ) : (
            <div className="space-y-4">
              {alunosResults.map((res, i) => {
                const percentual = (res.score / res.total) * 100
                const cor = percentual >= 70 ? 'text-success bg-success/10 border-success/20' : percentual >= 50 ? 'text-warning bg-warning/10 border-warning/20' : 'text-danger bg-danger/10 border-danger/20'
                
                return (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-800/50 border border-surface-700 gap-4">
                    <div>
                      <h3 className="font-semibold text-text-primary">{res.displayName}</h3>
                      <p className="text-sm text-text-muted">Realizado em {res.date}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border ${cor} font-bold whitespace-nowrap`}>
                      Nota: {res.score} / {res.total} ({percentual.toFixed(0)}%)
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fluxo do Aluno: Finalizado
  if (finished && previousResult) {
    const percentual = (previousResult.score / previousResult.total) * 100
    const foiBem = percentual >= 70

    return (
      <div className="space-y-6 max-w-2xl mx-auto mt-8">
        <div className="glass-card p-8 text-center animate-fade-in-up">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${foiBem ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
            {foiBem ? <CheckCircleIcon className="w-8 h-8" /> : <AlertCircleIcon className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Avaliação Concluída!</h2>
          <p className="text-text-secondary mb-6">
            Você já realizou a sua prova de nivelamento. O professor avaliará suas maiores dificuldades para montar um plano de estudos focado.
          </p>
          
          <div className="inline-block p-6 rounded-2xl bg-surface-800/50 border border-surface-700 mb-6">
            <p className="text-sm text-text-muted mb-1">Seu Resultado</p>
            <p className={`text-4xl font-black ${foiBem ? 'text-success' : 'text-warning'}`}>
              {previousResult.score} <span className="text-lg text-text-muted font-normal">/ {previousResult.total}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fluxo do Aluno: Não iniciado
  if (!started) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto mt-8">
        <div className="glass-card p-8 animate-fade-in-up text-center">
          <TargetIcon className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Avaliação Diagnóstica</h1>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Olá, {user.displayName}! Antes de começarmos as aulas, precisamos entender o seu nível atual em Matemática. 
            Esta avaliação tem 10 questões e servirá para mapear suas facilidades e dificuldades.
          </p>

          <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-xl text-brand-300 text-sm mb-8 text-left max-w-lg mx-auto">
            <ul className="list-disc list-inside space-y-2">
              <li>Faça com calma e sem pressa.</li>
              <li>Não use calculadora, o objetivo é saber o seu nível real.</li>
              <li>Pegue papel e caneta para os rascunhos.</li>
            </ul>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="btn-glow"
          >
            <span>Iniciar Avaliação</span>
          </button>
        </div>
      </div>
    )
  }

  const questao = questoes[currentIndex]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questoes.length) * 100

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questao.id]: optionIndex }))
  }

  const handleNext = () => {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Finalizar prova
      let acertos = 0
      questoes.forEach(q => {
        if (answers[q.id] === q.respostaCerta) acertos++
      })
      
      const result: NivelamentoResult = {
        username: user.username,
        displayName: user.displayName,
        score: acertos,
        total: questoes.length,
        date: new Date().toLocaleDateString('pt-BR')
      }

      localStorage.setItem(`aula-privada-nivelamento-${user.username}`, JSON.stringify(result))
      setScore(acertos)
      setPreviousResult(result)
      setFinished(true)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-4">
      {/* Progress Bar */}
      <div className="glass-card p-4 flex items-center gap-4 animate-fade-in-up">
        <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
          Questão {currentIndex + 1} de {questoes.length}
        </span>
        <div className="flex-1 h-2 bg-surface-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold mb-4 border border-brand-500/20">
          {questao.tema}
        </span>
        <h2 className="text-xl text-text-primary font-medium mb-8 leading-relaxed">
          {questao.pergunta}
        </h2>

        <div className="space-y-3">
          {questao.opcoes.map((opcao, idx) => {
            const isSelected = answers[questao.id] === idx
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3
                  ${isSelected 
                    ? 'bg-brand-500/10 border-brand-500 text-brand-300 ring-1 ring-brand-500/50' 
                    : 'bg-surface-800/50 border-surface-700 text-text-secondary hover:border-brand-500/30 hover:bg-surface-700'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                  ${isSelected ? 'border-brand-500 bg-brand-500/20' : 'border-surface-600'}
                `}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                </div>
                <span>{opcao}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2.5 rounded-xl font-medium text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={answers[questao.id] === undefined}
          className="px-6 py-2.5 rounded-xl font-medium bg-brand-600 text-white hover:bg-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentIndex === questoes.length - 1 ? 'Finalizar Avaliação' : 'Próxima Questão'}
        </button>
      </div>
    </div>
  )
}
