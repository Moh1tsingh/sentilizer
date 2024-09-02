import type { NextAuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "./db";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token }: any) {
      return token;
    },
    async session({ session, token }: any) {
      //   const user = await prisma.user.findUnique({
      //     where: {
      //       id: token.sub,
      //     },
      //   });
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;
