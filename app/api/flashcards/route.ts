'use server';
import { addFlashcard, checkApiLimit, deleteFlashcardById, getFlashcardsByNoteId, increaseLimit, updateFlashcardById } from "@/lib/handleNote";
import { NextRequest, NextResponse } from "next/server";
import {auth} from '@/auth'
import { useSession } from "next-auth/react";
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
        const authen = await auth();
        const freeTrial = await checkApiLimit(authen?.id as string);
        if (!freeTrial){
            return new NextResponse("Free trial limit reached", {status: 403});
        }
        const createFlashcard = addFlashcard(flashcard.id, flashcard.flashcards);
        await increaseLimit(authen?.id as string);
        return new Response(JSON.stringify(createFlashcard), {status: 200});
    } catch (error) {
        console.log("Error creating flashcard:", error);
    }
}