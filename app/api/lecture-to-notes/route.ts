import OpenAI from "openai"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request){
try {
    const { userId } = await auth();
    const body = await req.json();
    
    const {messages, transcript } = body;
    if (!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!openai.apiKey){
        return new NextResponse("OpenAI Key not configured", { status: 500 });
    }
    if (!messages){
        return new NextResponse("Messages not provided", { status: 400 });
    }
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": "\nPrompt:\n1. Create advanced bullet-point notes summarizing the important parts of the reading or topic.\n2. Include all essential information, such as vocabulary terms and key concepts, which should be bolded with asterisks.\n3. Remove any extraneous language, focusing only on the critical aspects of the passage or topic.\n4. Strictly base your notes on the provided information, without adding any external information.\n5. Make the notes easy for me to understand, break down all the concept into smaller concepts. Provide links that could help me understand concepts but do not use them in writing your notes. \n6. Provide all examples the lecture notes use break down the examples and debug them all in a professor manner.\n7. Conclude your notes with [End of Notes] to indicate completion.\nBy following this prompt, you will help me better understand the material and prepare for any relevant exams or assessments. Here are the notes of my lecture: \n"
                }
              ]
            },
            {
              "role": "user",
              "content": transcript
            },
          ],

        response_format: {
          "type": "text"
          
        },
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
    return NextResponse.json(response.choices[0].message);
} catch (error) {
    console.log("[CONVERSION ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
    
}
}