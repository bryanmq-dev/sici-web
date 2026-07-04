import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Uses Edge-safe authConfig — no Node.js crypto, no db
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/admin/:path*'],
};
