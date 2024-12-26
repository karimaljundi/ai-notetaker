import { getFlashcardsByNoteId } from "@/lib/handleNote";
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
