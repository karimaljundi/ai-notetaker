import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
try {
    const body = await req.json();
   
    
    const {messages, transcript } = body;
    if (!openai.apiKey){
        return new NextResponse("OpenAI Key not configured", { status: 500 });
    }
    if (!messages){
        return new NextResponse("Messages not provided", { status: 400 });
    }
    // const brokenTranscript = chunkTranscriptBySentences(transcript);
    // console.log("Broken Transcript", brokenTranscript);
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": "Prompt:\n1. Create structured notes summarizing the important parts of the topic in a **JSON format**.\n2. Organize the JSON object into the following keys:\n   - **title**: The title of the lecture or topic.\n   - **sections**: An array of objects, where each object represents a section with:\n     - **title**: The title of the section.\n     - **content**: An array of strings, each string representing a key point in the section.\n     - **examples** (optional): An array of objects, where each object includes:\n       - **description**: A brief description of the example.\n       - **details**: An array of strings, each providing additional explanation or steps for the example.\n     - **conclusion** (optional): A string summarizing the insights from the section, if applicable.\n3. Format important vocabulary terms or key concepts as **bold** (e.g., `**term**`).\n4. Include mathematical formulas or technical terms in their proper format.\n5. Do not add any external information—strictly base the JSON on the provided content.\n6. Ensure the final JSON is valid and adheres to this structure.\n\n**Example JSON Output:**\n```json\n{\n  \"title\": \"Lecture Notes on [Topic]\",\n  \"sections\": [\n    {\n      \"title\": \"Section Title\",\n      \"content\": [\n        \"Key point 1.\",\n        \"Key point 2.\",\n        \"Key point 3.\"\n      ],\n      \"examples\": [\n        {\n          \"description\": \"Example description.\",\n          \"details\": [\n            \"Detail 1.\",\n            \"Detail 2.\",\n            \"Detail 3.\"\n          ]\n        }\n      ],\n      \"conclusion\": \"A summary of the section, if applicable.\"\n    }\n  ]\n}\n"

                }
              ]
            },
            {
              "role": "user",
              "content": transcript
            },
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
      console.log("OpenAI Response", response.choices[0].message.content);
      console.log("Response type", typeof response.choices[0].message.content);
    return NextResponse.json(response.choices[0].message.content);
} catch (error) {
    // console.log("[CONVERSION ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
    
}
}


