import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Try database authentication if DATABASE_URL is set
        if (process.env.DATABASE_URL) {
          try {
            const { db } = await import("./db/client");
            const { users } = await import("./db/schema");
            const { eq } = await import("drizzle-orm");

            const [user] = await db
              .select()
              .from(users)
              .where(eq(users.email, credentials.email.toLowerCase()))
              .limit(1);

            if (!user) {
              throw new Error("No account found with this email");
            }
            if (!user.passwordHash) {
              throw new Error("Please sign in with Google or Facebook");
            }
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.passwordHash
            );
            if (!isPasswordValid) {
              throw new Error("Incorrect password");
            }
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.avatar || null,
            };
          } catch (dbError: unknown) {
            const message = dbError instanceof Error ? dbError.message : "";
            if (
              message.includes("No account found") ||
              message.includes("Incorrect password") ||
              message.includes("Please sign in")
            ) {
              throw new Error(message);
            }
            console.error("DB auth error:", dbError);
          }
        }

        // Demo/fallback mode when DB is not configured
        return {
          id: "demo-" + Date.now(),
          email: credentials.email,
          name: credentials.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "afrimatch-fallback-secret-change-in-production",
};
