import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isLoginPage = nextUrl.pathname === '/login'
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isDashboardRoute =
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname === '/'

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
