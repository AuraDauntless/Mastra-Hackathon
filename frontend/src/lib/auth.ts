import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET || "dauntless_ops_super_secret_key_12345",
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token-v2`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "mock_github_id",
      clientSecret: process.env.GITHUB_SECRET || "mock_github_secret",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_SECRET || "mock_google_secret",
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email/Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Strict check for admin dummy creds
        if (credentials?.email === 'admin' && credentials?.password === 'password123') {
          const user = await prisma.user.upsert({
            where: { email: 'admin@dauntless.ops' },
            update: {},
            create: {
              email: 'admin@dauntless.ops',
              name: "Super Admin",
              plan: "ENTERPRISE",
            }
          });
          return { id: user.id, email: user.email, name: user.name };
        }
        
        // Allow normal demo users to login with just an email
        if (credentials?.email && credentials.email !== 'admin') {
          const user = await prisma.user.upsert({
            where: { email: credentials.email },
            update: {},
            create: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              plan: "FREE",
            }
          });
          return { id: user.id, email: user.email, name: user.name };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
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
