import OpenAI from "openai";
import { streamObject, streamText } from 'ai'
import { NextResponse } from "next/server";
import { checkApiLimit, getNoteById, increaseLimit } from "@/lib/handleNote";
import { openai } from '@ai-sdk/openai';
import { auth } from "@/auth";


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

export async function POST(req: Request){
    const {messages, noteId} = await req.json();
    const note = await getNoteById(noteId);
    const noteContent = JSON.parse(note).content;
    console.log("note:", noteContent);
    const authen = await auth();
            const freeTrial = await checkApiLimit(authen?.id as string);
            if (!freeTrial){
                console.log("[API LIMIT REACHED]");
                return new NextResponse("Free trial limit reached", {status: 403});
            }
    const textStream = streamText({
        model: openai('gpt-4-turbo'),
        prompt: `You are an expert AI tutor specializing in explaining academic concepts from lecture notes. Your role is to help students understand the material through clear, structured explanations.

Context: You have access to lecture notes with the following content:
${noteContent}

Guidelines:
1. Always base your answers on the lecture notes content
2. When examples are requested:
   - First use examples from the notes if available
   - Then explain how they demonstrate the concept
4. If information isn't in the notes:
   - Acknowledge this explicitly
    - Provide a general explanation or definition
    - Suggest further reading or resources


Format Responses:
- Use clear paragraphs for main explanations
- Utilize bullet points for lists
- Include relevant definitions in quotes
- Break down complex topics step by step

Remember: You are having a conversation with a student trying to understand these specific lecture notes. Keep responses focused, relevant, and engaging.`,
    });
    await increaseLimit(authen?.id as string);
    return textStream.toDataStreamResponse();
}