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
        console.log("messages:", messages);
        console.log("note:", note);
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
            content: `Prompt: Extract and synthesize key concepts, terms, and ideas from the provided lecture notes, user inputs, and previously created quizzes. Use this information to generate multiple-choice questions (MCQs) with the following format:
- A question that tests the understanding, application, or analysis of a concept.
- Four answer options, including one correct answer and three plausible distractors.

Key guidelines:
1. **Reference Integration**: Use content from the provided lecture notes and incorporate previous quizzes (if available) to avoid redundancy and ensure variety.
2. **Answer Options**:
   - Ensure one correct answer is clearly identifiable.
   - Provide three plausible distractors that are logical and relevant but incorrect.
   - Use examples or real-world scenarios in questions and options when appropriate.
3. **JSON Format**: Structure the output as a valid JSON object:
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
4. **Conciseness and Focus**:
   - Ensure questions and options are clear, concise, and relevant.
   - Avoid overly ambiguous or tricky phrasing unless justified by difficulty level.
5. **Validation**:
   - Verify that each question has exactly one correct answer and three plausible distractors.
   - Conclude with a fully valid and error-free JSON object.

Provide a variety of questions that effectively test understanding across difficulty levels and validate the final JSON structure to ensure correctness.`
        },
        {
            role: "user",
            content: JSON.stringify(note) + "\n" + prompt + "\n" + JSON.stringify(messages)
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