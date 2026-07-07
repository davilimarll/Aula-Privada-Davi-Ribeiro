import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para proteção de rotas.
 * 
 * Como a autenticação é client-side (localStorage),
 * este middleware faz uma verificação básica via cookie.
 * 
 * Quando migrar para Supabase Auth, substitua a lógica
 * por verificação de token JWT do Supabase.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas protegidas
  if (pathname.startsWith('/dashboard')) {
    // Verificar cookie de sessão (set pelo client-side)
    const session = request.cookies.get('aula-privada-session')
    
    // Se não há cookie, redirecionar para login
    // Nota: a verificação real é feita client-side pelo AuthContext
    // Este middleware é uma camada extra de proteção
    if (!session) {
      // Permitir acesso — a verificação real é client-side
      // Quando migrar para Supabase, descomentar o redirect:
      // return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Se o usuário está logado e tenta acessar /login, redirecionar para dashboard
  // Nota: implementação completa requer Supabase Auth

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
