import OpenAI from "openai"
import { NextResponse } from "next/server"
import { auth } from "@/auth";
import { checkApiLimit, getApiLimit, increaseLimit } from "@/lib/handleNote";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
try {
  const body = await req.json();
    
    const {messages, transcript } = body;
    // console.log('messages', messages);
    console.log('transcript', transcript);
    if (!openai.apiKey){
        return new NextResponse("OpenAI Key not configured", { status: 501 });
    }
    if (!messages){
        return new NextResponse("Messages not provided", { status: 400 });
    }
    
    const verificationResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
          {
              role: "system",
              content: "You are a content classifier. Analyze the given transcript and determine if it's from an educational lecture. Respond with a JSON object containing: isLecture (boolean)."
          },
          {
              role: "user",
              content: transcript
          }
      ],
      response_format: {
        type: "json_object"
      }
  });
  console.log("Verification response", verificationResponse.choices[0].message.content);
  console.log("type of verification response", typeof verificationResponse.choices[0].message.content);
  const verified = JSON.parse(verificationResponse.choices[0].message.content);
  const authen = await auth();
  const checkApiLimitUser = await checkApiLimit(authen?.id)
  if (!checkApiLimitUser){
    return new NextResponse("[API LIMIT EXCEEDED]", { status: 429 });
  }
  if (!verified.isLecture){
    return new NextResponse("Transcript is not from an educational lecture", { status: 400 });
  }

  const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "Create comprehensive and detailed structured notes summarizing the important parts of the topic in a JSON format, akin to taking notes during a lecture with insights and context.\n\nOrganize the JSON object into the following keys:\n\n- **title**: The title of the lecture or topic.\n- **sections**: An array of objects, where each object represents a section with:\n  - **title**: The title of the section.\n  - **content**: An array of strings, each string representing a key point in the section. Provide context and explanation for each key point, resembling a contextual breakdown.\n  - **examples** (optional): An array of objects, where each object includes:\n    - **description**: A brief description of the example, ensuring clarity on its significance.\n    - **details**: An array of strings, providing comprehensive explanation, context, or steps related to the example.\n  - **conclusion** (optional): A string summarizing the insights from the section, if applicable, providing a reflective synthesis of the section.\n\n- Format important vocabulary terms or key concepts as **bold** (e.g., `**term**`).\n- Include mathematical formulas or technical terms in their proper format.\n- Base the JSON strictly on the provided content without adding external information.\n- Ensure the final JSON is valid and adheres to this structure.\n\n# Steps\n\n1. Begin by identifying the lecture or topic title, and assign it to the \"title\" key.\n2. For each section within the topic, create an object with a \"title\", \"content\", and optional sections for \"examples\" and \"conclusion\".\n3. Break down the \"content\" with detailed explanations, ensuring to capture the nuances and essential points.\n4. For \"examples\", elucidate each with a \"description\" and detailed \"details\", adding context or extending on related concepts.\n5. Summarize the section’s \"conclusion\" if applicable, ensuring it encapsulates the insights comprehensively.\n6. Validate and format words or phrases as **bold** for emphasis.\n\n# Output Format\n\nEnsure the output is in a structured JSON format detailing each section comprehensively with enriched context and examples.\n\n# Examples\n\n**Example JSON Output:**\n\n```json\n{\n  \"title\": \"Lecture Notes on Advanced Thermodynamics\",\n  \"sections\": [\n    {\n      \"title\": \"Introduction to Thermodynamics\",\n      \"content\": [\n        \"Thermodynamics is the study of **energy** and **energy** transfer.\",\n        \"The laws of thermodynamics are critical in describing the behavior of energy in systems.\",\n        \"Understanding the concept of **entropy** is essential for comprehensively understanding thermodynamic processes.\"\n      ],\n      \"examples\": [\n        {\n          \"description\": \"An example illustrating heat exchange in an isolated system.\",\n          \"details\": [\n            \"Consider a sealed container with gas; ensure no heat is exchanged with the environment.\",\n            \"The behavior of gas particles results in uniform distribution of temperatures over time.\",\n            \"This demonstrates the law of energy conservation within isolated systems.\"\n          ]\n        }\n      ],\n      \"conclusion\": \"Thermodynamics provides foundational understanding influencing multiple scientific disciplines.\"\n    }\n  ]\n}\n```\n\n# Notes\n\n- Create detailed sections and capture the essence of each segment as if taking comprehensive notes during a lecture.\n- Include context and extensions to ensure clarity within each key point.\n- Focus on accurately capturing terminology and contextual relevance.\n"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": transcript
            }
          ]
        }
      ],
      response_format: {
        "type": "json_object"
      },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    await increaseLimit(authen?.id)
      // console.log("OpenAI Response", response.choices[0].message.content);
      // console.log("Response type", typeof response.choices[0].message.content);
    return NextResponse.json(response.choices[0].message.content);
} catch (error) {
  console.error("[LECTURE_TO_NOTES_ERROR]", error);
    // console.log("[CONVERSION ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
    
}
}


