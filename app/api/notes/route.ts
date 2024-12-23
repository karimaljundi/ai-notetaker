'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { addNote, getNotesByEmail } from '@/lib/handleNote';

export async function POST(req: Request, res: Response) {
   try{ const { title, content, email } = await req.json();
    console.log("In route file: ", title, email);
    const note = await addNote(title, content, email);
    console.log("Note added to database", note);
    console.log("status 200");
    return new Response(JSON.stringify(note), {status: 201});
}
    catch{
        console.log("status 500");
        return new Response(JSON.stringify({error: "Failed to add note"}), {status: 500});
    }  
}
export async function GET(req: Request, res: Response) {
    try{
        const { email } = await req.json();
        console.log("In route file GET: ", email);
        const notes = await getNotesByEmail(email);
        console.log("status 200");
        return new Response(JSON.stringify(notes), {status: 200});
    }
    catch{
        console.log("status 500");
        return new Response(JSON.stringify({error: "Failed to get notes"}), {status: 500});
    }
}