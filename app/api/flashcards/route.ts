'use server';
import { addFlashcard, deleteFlashcardById, getFlashcardsByNoteId, updateFlashcardById } from "@/lib/handleNote";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") as string;
    try{
        const flashcards = await getFlashcardsByNoteId(id);
        return new Response(flashcards, {status: 200});
    }
    catch{
        // console.log("status 500");
        return new Response(JSON.stringify({error: "Failed to get notes"}), {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") as string;
    try {
        const deletedFlashcard = await deleteFlashcardById(id);
        return new Response(deletedFlashcard, {status: 200});
    } catch (error) {
        console.log("Error deleting flashcard:", error);
    }
}
export async function PUT(req: NextRequest){
    try {
        const id = req.nextUrl.searchParams.get("id") as string;
        const flashcard = await req.json();
        console.log("Updating flashcard in route:", flashcard.params.id);
        const updatedFlashcard = await updateFlashcardById(flashcard.params.id, flashcard.params.flashcard);
        return new Response(updatedFlashcard, {status: 200});
        
    } catch (error) {
        console.log("Error updating flashcard:", error);
    }
}
export async function POST(req: NextRequest){
    try {
        const flashcard = await req.json();
        console.log("Creating flashcard in route:", flashcard);
        const createFlashcard = addFlashcard(flashcard.id, flashcard.flashcards);
        return new Response(JSON.stringify(createFlashcard), {status: 200});
    } catch (error) {
        console.log("Error creating flashcard:", error);
    }
}