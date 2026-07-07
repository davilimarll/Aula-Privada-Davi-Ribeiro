'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  displayName: string
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
const DEMO_CREDENTIALS = {
  username: 'Kirk',
  password: '2525',
  displayName: 'Kirk',
}

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
    if (
      username.toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase() &&
      password === DEMO_CREDENTIALS.password
    ) {
      const loggedUser: User = {
        username: DEMO_CREDENTIALS.username,
        displayName: DEMO_CREDENTIALS.displayName,
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
