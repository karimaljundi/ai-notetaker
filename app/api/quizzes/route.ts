'use server';
import { addQuiz, addQuizzes, deleteQuizById, getQuizzesByNoteId, updateQuizById } from "@/lib/handleNote";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") as string;
    try{
        const quizzes = await getQuizzesByNoteId(id);
        console.log("Quizzes:", quizzes);
        return new Response(JSON.stringify(quizzes), {status: 200});
    }
    catch{
        // console.log("status 500");
        return new Response(JSON.stringify({error: "Failed to get notes"}), {status: 500});
    }
}
export async function POST(req: NextRequest) {
    try {
        const {id, quiz } = await req.json();
        console.log("Adding quiz to note:", id);
        console.log("Quiz in route.ts:", quiz);
        console.log("quiz type:", typeof quiz);
        const createdQuiz = await addQuiz(id, quiz);
        console.log("Quiz created", createdQuiz);
        return new Response(JSON.stringify({ message: "Quiz created" }), { status: 200 });
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}
export async function PUT(req: NextRequest){
    try {
        const id = req.nextUrl.searchParams.get("id") as string;
        const quiz = await req.json();
        console.log("Updating flashcard in route:", quiz.params.id);
        const updatedQuiz = await updateQuizById(quiz.params.id, quiz.params.quiz);
        return new Response(updatedQuiz, {status: 200});
        
    } catch (error) {
        console.log("Error updating flashcard:", error);
    }
}
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") as string;
    try {
        const deletedQuiz = await deleteQuizById(id);
        return new Response(deletedQuiz, {status: 200});
    } catch (error) {
        console.log("Error deleting flashcard:", error);
    }
}