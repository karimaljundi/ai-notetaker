import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
// });
    //     const msg = await anthropic.messages.create({
//       model: "claude-3-5-sonnet-20241022",
//       max_tokens: 1024,
//       temperature: 0,
//       tools: [
//         {
//           "name": "formatNotes",
//           "description": "Format the notes into a structured JSON object",
//           "input_schema": {
//             "type": "object",
//             "properties": {
//               "title": {
//                 "type": "string",
//                 "description": "The main topic or title of the lecture/content"
//               },
//               "sections": {
//                 "type": "array",
//                 "items": {
//                   "type": "object",
//                   "properties": {
//                     "title": {
//                       "type": "string",
//                       "description": "The title of the section"
//                     },
//                     "content": {
//                       "type": "array",
//                       "items": {
//                         "type": "string",
//                         "description": "Detailed key points"
//                       }
//                     },
//                     "examples": {
//                       "type": "array",
//                       "items": {
//                         "type": "object",
//                         "properties": {
//                           "description": {
//                             "type": "string",
//                             "description": "Brief description of the example"
//                           },
//                           "details": {
//                             "type": "array",
//                             "items": {
//                               "type": "string",
//                               "description": "Additional explanation or steps"
//                             }
//                           }
//                         },
//                         "required": [
//                           "description",
//                           "details"
//                         ]
//                       }
//                     },
//                     "conclusion": {
//                       "type": "string",
//                       "description": "Summary of section insights"
//                     }
//                   },
//                   "required": [
//                     "title",
//                     "content"
//                   ]
//                 }
//               }
//             },
//             "required": [
//               "title",
//               "sections"
//             ]
//           }
//         }
          
//       ],
//       messages: [
//         {
//             role: "user",
//             content: basePrompt + transcriptSection + instructionsSection
                
//         }
//     ],
//   });


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
    

    const basePrompt = 'You are an expert note-taker and summarizer, tasked with creating comprehensive, structured notes from a given transcript. Your goal is to produce detailed, accurate, and informative notes in a specific JSON format.\n\n';
    const transcriptSection = 'Here is the transcript you need to analyze and summarize:\n\n<transcript>\n' + transcript + '\n</transcript>\n\n';
    const instructionsSection = 'Please follow these steps to create your structured notes:\n\n1. Carefully read and analyze the transcript.\n\n2. Wrap your analysis inside <content_breakdown> tags:\n   a) Identify the main topic and create a concise but descriptive title.\n   b) List key themes or recurring topics in the transcript.\n   c) Create a rough outline of the content structure.\n   d) Identify the main sections of the content.\n   e) For each section:\n      - List key points, ensuring they are detailed and accurate.\n      - Identify relevant examples, if any.\n      - Create a conclusion summarizing the main insights, if applicable.\n   f) Identify important vocabulary terms or key concepts to be formatted in bold.\n   g) Note any mathematical formulas or technical terms that require special formatting.\n   h) List any questions or uncertainties about the content that need clarification.\n\n3. Based on your analysis, create a JSON object with the following structure:\n   - \"title\": The main topic or title of the lecture/content.\n   - \"sections\": An array of objects, each representing a section with:\n     - \"title\": The title of the section.\n     - \"content\": An array of strings, each representing a detailed key point.\n     - \"examples\" (optional): An array of objects, each with:\n       - \"description\": A brief description of the example.\n       - \"details\": An array of strings providing additional explanation or steps.\n     - \"conclusion\" (optional): A string summarizing the insights from the section.\n\n4. Ensure that:\n   - Important terms or concepts are formatted as **bold** (e.g., `**term**`).\n   - Mathematical formulas and technical terms are properly formatted.\n   - The JSON is valid and adheres to the specified structure.\n   - You do not add any external information not present in the transcript.\n\n5. Review your JSON to ensure it is comprehensive, accurate, and provides detailed explanations and examples as requested.\n\nHere\'s an example of the expected JSON structure (note that this is a generic example and your content should be based entirely on the provided transcript):\n\n```json\n{\n  \"title\": \"Comprehensive Lecture Notes on [Main Topic]\",\n  \"sections\": [\n    {\n      \"title\": \"Introduction to [Subtopic]\",\n      \"content\": [\n        \"Detailed explanation of key point 1, including its significance and context.\",\n        \"In-depth discussion of key point 2, covering multiple aspects and implications.\",\n        \"Comprehensive overview of key point 3, with references to related concepts.\"\n      ],\n      \"examples\": [\n        {\n          \"description\": \"Practical application of [concept]\",\n          \"details\": [\n            \"Step-by-step explanation of the example.\",\n            \"Discussion of potential variations or edge cases.\",\n            \"Analysis of the example\'s relevance to the main topic.\"\n          ]\n        }\n      ],\n      \"conclusion\": \"A thorough summary of the section, highlighting key takeaways and their broader implications.\"\n    }\n  ]\n}\n```\n\nPlease proceed with your analysis and then create the JSON-formatted notes based on the transcript provided.'

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
      console.log("OpenAI Response", response.choices[0].message.content);
      console.log("Response type", typeof response.choices[0].message.content);
    return NextResponse.json(response.choices[0].message.content);
} catch (error) {
    // console.log("[CONVERSION ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
    
}
}


