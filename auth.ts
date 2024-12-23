import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from 'next-auth/providers/credentials';
import { saltAndHashPassword } from "./lib/utils";
import { db } from "./db";
import bcrypt from "bcryptjs";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
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
        }),
        Credentials({name: "Credentials", credentials: {
            name: {label: "Name", type: "text"},
            email: {label: "Email", type: "email"},
            password: {label: "Password", type: "password"},
        }, 
        authorize: async (credentials) => {
            if (!credentials || !credentials.email || !credentials.password) {
                return null;
            }
            const email = credentials.email as string;
            const hash = saltAndHashPassword(credentials.password.toString());
            const name = credentials.name as string;

            let user = await db.user.findUnique({where: {email}});
            if (!user) {
                user = await db.user.create({data: { name, email, hashedPassword: hash}});
            }
            else{
                const isMatch = bcrypt.compareSync(credentials.password as string, user.hashedPassword as string);
                if (!isMatch) {
                    return new Error("Password does not match");
                }
            }
            return user;
        }
    }),
    ],
});

