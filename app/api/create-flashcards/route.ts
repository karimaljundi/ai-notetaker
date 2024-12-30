'use server'

import { addFlashcards } from '@/lib/handleNote';
export async function POST(req: Request) {
    try {
        const {id, flashcards } = await req.json();
            console.log("Updating note:", id);
            console.log("Flashcards in route.ts:", flashcards);
            const updatedNote = await addFlashcards(id, flashcards);
            console.log("Note updated with flashcards", updatedNote);
            return new Response(updatedNote, { status: 200 });
        
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}