import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: process.env.NODE_ENV === 'production' ? PrismaAdapter(prisma) : undefined,
  providers: ((): any[] => {
    const p: any[] = [];
    p.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }));
    // Only add Email provider when an adapter/database is configured
    if (process.env.DATABASE_URL) {
      p.push(EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
          port: Number(process.env.EMAIL_SERVER_PORT || 587),
          secure: process.env.EMAIL_SERVER_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_SERVER_USER || '',
            pass: process.env.EMAIL_SERVER_PASSWORD || ''
          }
        },
        from: process.env.EMAIL_FROM || 'no-reply@example.com'
      }));
    }

    p.push(CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Shortcut for local development: accept a known test account without DB
          if (process.env.NODE_ENV !== 'production' && credentials.email === 'test@example.com' && credentials.password === 'pass123') {
            return {
              id: 'dev-test-id',
              email: 'test@example.com',
              name: 'Dev Test'
            };
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) {
            return null;
          }

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
      }
    }));
    return p;
  })(),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub }
          });
          if (dbUser) {
            session.user.role = dbUser.role;
          }
        } catch (e) {
          // Ignore DB errors in development (e.g., missing DATABASE_URL)
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
};

export default NextAuth(authOptions);
