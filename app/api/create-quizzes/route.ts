import { addQuizzes } from "@/lib/handleNote";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {id, quiz } = await req.json();
        console.log("Adding quiz to note:", id);
        console.log("Quiz in route.ts:", quiz);
        console.log("quiz type:", typeof quiz);
        const createdQuiz = await addQuizzes(id, quiz);
        console.log("Quiz created", createdQuiz);
        return new Response(JSON.stringify({ message: "Quiz created" }), { status: 200 });
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}