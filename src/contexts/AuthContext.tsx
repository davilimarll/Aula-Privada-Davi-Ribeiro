'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  displayName: string
  role: 'professor' | 'aluno'
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Credenciais hardcoded para demonstração.
 * Quando o Supabase Auth for ativado, substitua a lógica
 * de login/logout por chamadas ao supabase.auth
 */
const DEMO_USERS = [
  {
    username: 'Kirk',
    password: '2525',
    displayName: 'Kirk',
    role: 'aluno' as const,
  },
  {
    username: 'Breno',
    password: '0105',
    displayName: 'Breno',
    role: 'aluno' as const,
  },
  {
    username: 'Davi',
    password: '1010',
    displayName: 'Prof. Davi Ribeiro',
    role: 'professor' as const,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('aula-privada-user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('aula-privada-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Validação hardcoded para demo
    const validUser = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )

    if (validUser) {
      const loggedUser: User = {
        username: validUser.username,
        displayName: validUser.displayName,
        role: validUser.role,
      }
      setUser(loggedUser)
      localStorage.setItem('aula-privada-user', JSON.stringify(loggedUser))
      return true
    }

    // TODO: Substituir por Supabase Auth
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: username,
    //   password: password,
    // })

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('aula-privada-user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
