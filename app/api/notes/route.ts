'use server'
// import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from "next/server";

import { addNote, getNotesByEmail } from '@/lib/handleNote';

export async function POST(req: Request) {
   try{ const { title, content, email } = await req.json();
    console.log("In route file: ", title, email);
    const note = await addNote(title, content, email);
    console.log("Note added to database", note);
    return new Response(note, {status: 201});
}
    catch{
        return new Response(JSON.stringify({error: "Failed to add note"}), {status: 500});
    }  
}
export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email") as string;

    try{
        console.log("In route file GET: ", email);
        const notes = await getNotesByEmail(email);
        return new Response(notes, {status: 200});
    }
    catch{
        console.log("status 500");
        return new Response(JSON.stringify({error: "Failed to get notes"}), {status: 500});
    }
}