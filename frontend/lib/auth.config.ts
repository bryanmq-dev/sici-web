import type { NextAuthConfig, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// Edge-safe config — no bcrypt, no db imports, JWT-only
export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    // Exposes token.role into session.user so authorized() can read it
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      if (!nextUrl.pathname.startsWith('/admin')) return true;
      return !!auth?.user && auth.user.role === 'admin';
    },
  },
  providers: [],
} satisfies NextAuthConfig;
