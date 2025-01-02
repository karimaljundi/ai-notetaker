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
                console.log("Profile in auth.ts: ", profile);

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
                name: { label: "Name", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }
                const email = credentials.email as string;
                const hash = saltAndHashPassword(credentials.password.toString());
                const name = credentials.name as string;

                let user = await db.user.findUnique({ where: { email } });
                // let user = await sql`SELECT * FROM User WHERE email = ${email}`;
                if (!user) {
                    user = await db.user.create({
                        data: {
                            name,
                            email,
                            hashedPassword: hash,
                            Provider: "Credentials",
                        },
                    });
                    // user = await sql`INSERT INTO User (name, email, hashedPassword, Provider) VALUES (${name}, ${email}, ${hash}, 'Credentials')`;
                } else {
                    const isMatch = bcrypt.compareSync(credentials.password as string, user.hashedPassword?.toString() as string);
                    if (!isMatch) {
                        return new Error("Password does not match");
                    }
                }
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token,trigger, user }) {

            
          // Persist the OAuth access_token to the token right after signin
          if (user) {
            console.log("token in auth.ts:", token);
            console.log("trigger in auth.ts:", trigger);
            console.log("user in auth.ts:", user);            
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
            console.log("session in auth.ts:", session);
            console.log("token in auth.ts:", token);
            session.apiLimit = token.apiLimit;
            session.id = token.id;

          return session;
        },
      },
        
});