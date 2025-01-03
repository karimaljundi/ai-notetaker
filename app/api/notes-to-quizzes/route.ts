import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkApiLimit, increaseLimit } from "@/lib/handleNote";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, note, prompt } = body;
        // console.log("Received request body:", body);
        console.log("messages in quiz:", messages);
        console.log("note in quiz:", JSON.stringify(note));
        console.log("prompt in ai:", prompt);

        if (!openai.apiKey) {
            return new NextResponse("OpenAI Key not configured", { status: 500 });
        }
        const authen = await auth();
        const freeTrial = await checkApiLimit(authen?.id as string);
        if (!freeTrial){
            console.log("[API LIMIT REACHED]");
            return new NextResponse("Free trial limit reached", {status: 403});
          }
//         const placeholderResponse =`{
//    "questions": [
//      {
//        "question": "Question text here",
//        "options": [
//          "Option A",
//         "Option B",
//          "Option C",
//          "Option D"
//       ],
//       "correct_answer": "Option A"
//     },
//     {
//       "question": "Another question text here",
//       "options": [
//         "Option A",
//         "Option B",
//         "Option C",
//         "Option D"
//       ],
//       "correct_answer": "Option D"
//     }
//   ]
// }`

//         console.log("Using placeholder response:", placeholderResponse);
//         return NextResponse.json(placeholderResponse);

const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
        {
            role: "system",
            content: `
            If the user's prompt is unclear or not specific:
- Focus on definition and concept-based questions
- Extract key terms and create questions about them
- Test understanding of fundamental principles
- Include application-based questions

Create questions with:
1. Clear, unambiguous wording
2. One definitively correct answer
3. Three plausible but incorrect options
4. Mix of difficulties (Basic recall, Understanding, Application)

Validation Rules:
1. No duplicate questions from previous ones
2. All questions must come from the note content
3. Options must be distinct and clear
4. Correct answer must be unambiguous

Note content: ${JSON.stringify(note)}

 **JSON Format**: Structure the output as a valid JSON object:
{
  "questions": [
    {
      "question": "Question text here",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correct_answer": "Option A"
    },
    {
      "question": "Another question text here",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correct_answer": "Option D"
    }
  ]
}
Provide a variety of questions that effectively test understanding across difficulty levels and validate the final JSON structure to ensure correctness.`
        },
        {
            role: "user",
            content: JSON.stringify(note) + "\n" + prompt + "\n" + JSON.stringify(messages)
        },
        {
          "role": "user",
          content: JSON.stringify(messages)
        }
    ],
    response_format: { type: "json_object"},
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
});
await increaseLimit(authen?.id as string);
      return NextResponse.json(response.choices[0].message.content);
    } catch (error) {
        console.error("[CONVERSION ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}