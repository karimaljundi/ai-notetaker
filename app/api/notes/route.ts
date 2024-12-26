'use server'
// import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from "next/server";

import { addNote, getNoteById, getNotesByEmail, updateNoteById } from '@/lib/handleNote';



export async function POST(req: Request) {
    try {
        const { type, title, content, email, id, flashcards } = await req.json();
        console.log("Request type:", type);
        console.log("Request body:", title, content, email, id, flashcards);

        if (type === "create") {
            console.log("Creating note:", title, email);
            const note = await addNote(title, content, email);
            console.log("Note added to database", note);
            return new Response(note, { status: 201 });
        } else if (type === "update" && title===undefined && content===undefined && email===undefined) {
            console.log("Updating note:", id);
            const updatedNote = await updateNoteById(id, flashcards);
            console.log("Note updated with flashcards", updatedNote);
            return new Response(updatedNote, { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid request type" }), { status: 400 });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") as string;
    const email = req.nextUrl.searchParams.get("email") as string;

    try{
        if (email){
            const notes = await getNotesByEmail(email);
            return new Response(notes, {status: 200});
        }
        else if (id){
            const note = await getNoteById(id);
            return new Response(note, {status: 200});
        }
        
    }
    catch{
        // console.log("status 500");
        return new Response(JSON.stringify({error: "Failed to get notes"}), {status: 500});
    }
}
