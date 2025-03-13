import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from 'next-auth/providers/credentials';
import { saltAndHashPassword } from "./lib/utils";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { PrismaAdapter } from "@auth/prisma-adapter"
// const sql = neon(process.env.DATABASE_URL);

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    // adapter: PrismaAdapter(db),
    secret: process.env.SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            profile: async (profile) => {
                const email = profile.email;
                const name = profile.name;

                let user = await db.user.findUnique({ where: { email } });
                // let user = await sql`SELECT * FROM User WHERE email = ${email}`;
                if (!user) {
                    // user = await sql`INSERT INTO User (name, email, Provider) VALUES (${name}, ${email},'Google')`;
                    user = await db.user.create({
                        data: {
                            name,
                            email,
                            emailVerified: new Date(),
                            Provider: "Google",
                        },
                    });
                }
                return user;
            },
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await db.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user || !user.password) {
                        // Create user if doesn't exist (for testing/development)
                        if (process.env.NODE_ENV !== "production" && credentials.name) {
                            const newUser = await db.user.create({
                                data: {
                                    email: credentials.email,
                                    name: credentials.name,
                                    password: await bcrypt.hash(credentials.password, 10),
                                    role: "ADMIN"
                                }
                            });
                            return {
                                id: newUser.id,
                                email: newUser.email,
                                name: newUser.name,
                                role: newUser.role
                            };
                        }
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token,trigger, user }) {

            
          // Persist the OAuth access_token to the token right after signin
          if (user) {           
            token.apiLimit = user.apiLimit;
            token.id = user.id;
            if (trigger==="update"){
                token.apiLimit = user.apiLimit;
            }
            // token.accessToken = user.token;
            const dbUser = await db.user.findUnique({
                where: { email: token.email as string },
                select: { id: true }
            });
            if (dbUser) {
                token.id = dbUser.id;
            }
          }
          
          return token;
        },
        async session({ session, token, user }) {
            session.apiLimit = token.apiLimit;
            session.id = token.id;

          return session;
        },
      },
    pages: {
        signIn: "/sign-in",
    },
        
});