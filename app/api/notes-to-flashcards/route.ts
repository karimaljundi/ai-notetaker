import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addFlashcards, checkApiLimit, increaseLimit } from "@/lib/handleNote";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, note, prompt } = body;
        console.log("note", note);
        console.log("prompt", prompt);
        console.log("messages", messages);
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
//   "flashcards": [
//     {
//       "question": "What does a probability space consist of?",
//       "answer": "A probability space consists of a set S of outcomes and a probability function.",
//       "difficulty": "easy"
//     },
//     {
//       "question": "What criteria must the set S in a probability space meet?",
//       "answer": "The set S must be non-empty and countable, which means it either has a finite number of elements or is countably infinite.",
//       "difficulty": "easy"
//     },
//     {
//       "question": "Define a countably infinite set.",
//       "answer": "A set is countably infinite if there is a bijection between the set and the non-negative integers.",
//       "difficulty": "medium"
//     },
//     {
//       "question": "Provide an example of a countably infinite set.",
//       "answer": "The set of all integers is countably infinite, as each integer can uniquely correspond to a non-negative integer.",
//       "difficulty": "medium"
//     },
//     {
//       "question": "How is a simple coin toss modeled as an infinite probability model?",
//       "answer": "The model involves repeatedly tossing a coin until a head is achieved. The outcomes are sequences like H, TH, TTH, etc., each representing an event where the head first appears after zero or more tails.",
//       "difficulty": "medium"
//     },
//     {
//       "question": "How are probabilities calculated for the infinite coin toss sequence?",
//       "answer": "Probabilities of sequences are calculated using the formula: Probability = (1/2)^(n+1), where n is the number of tails preceding the first head.",
//       "difficulty": "medium"
//     },
//     {
//       "question": "Explain the concept of a game where two players flip a coin alternately until the first head is flipped.",
//       "answer": "In this game model, two players toss a coin alternately, and the game ends when the first head is flipped. The player who tosses the first head wins, and probabilities can be calculated to show theoretical fairness.",
//       "difficulty": "hard"
//     },
//     {
//       "question": "Describe the probability model for the 'Who Flips the Second Head?' game.",
//       "answer": "The game rules are similar to the first head game, but players continue playing after the first head until the second head is tossed. Probability calculations consider turns and the initial distribution of heads, aiming to analyze fairness.",
//       "difficulty": "hard"
//     },
//     {
//       "question": "How do probability theory and game theory apply to the strategy of playing multiple rounds in a coin toss game?",
//       "answer": "Advanced probability techniques and game theory are used to consider varied and compound game scenarios, extending to analyze multiple rounds and throws, which helps in understanding interdependencies and formulating strategic decisions.",
//       "difficulty": "hard"
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
                    content: `Prompt: Extract key concepts, terms, and ideas from the provided lecture notes or content.
If the user's prompt is unclear or not specific:
- Focus on creating definition-based flashcards
- Extract key terms and their explanations
- Create concept-explanation pairs
- Include fundamental principles

Create flashcards with:
- A question that prompts the user to recall or explain the concept
- An answer that provides a concise yet comprehensive explanation or definition
- Ensure the flashcards have a mixture of difficulty levels (Easy, Medium, and Hard)
- Include a difficulty key in each flashcard with values easy, medium, or hard

Priority for unclear prompts:
1. Key term definitions
2. Core concepts explained
3. Fundamental principles
4. Important relationships between concepts

When examples are available in the notes:
- Incorporate them into the answer for clarity and context

Main note content: ${JSON.stringify(note)}

Rules:
1. Only use information from the provided note
2. Each flashcard must directly relate to the main topic
3. Verify each card against source content
4. Don't mix in external knowledge
Structure the output as a JSON object with the following format:
{
  "flashcards": [
    {
      "question": "Question text here",
      "answer": "Answer text here",
      "difficulty": "easy"
    },
    {
      "question": "Another question text here",
      "answer": "Another answer text here",
      "difficulty": "medium"
    }
  ]
}
  Rules for avoiding duplicates:
1. Do not create cards with questions identical to previous ones
2. Do not create cards that ask the same concept in slightly different wording
3. If a concept has been covered, focus on uncovered aspects
4. Each card must be substantially different from existing ones

Create flashcards with:
- Unique questions not present in previous cards
- Clear, distinct concepts
- Different aspects of topics already covered
- New perspectives on the material
Balance the flashcards to include an appropriate number of questions for each difficulty level, ensuring a variety of challenges.
Ensure all questions are straightforward and relevant to the content provided, suitable for quick review or study.
Avoid adding extraneous information not present in the notes.
End the response with a valid JSON object.`
                },
                {
                    role: "user",
                    content: JSON.stringify(messages)
                },
               
            ],
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