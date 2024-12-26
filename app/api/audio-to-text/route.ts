import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from 'fs';
import path from 'path';
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const formData = await req.formData();
        const videoFile = formData.get("video");
        
        if (!videoFile || !(videoFile instanceof File)) {
            return new NextResponse("No valid video file provided", { status: 400 });
        }

        // console.log("formData", videoFile);

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Save the video file temporarily
        const filePath = path.join('/tmp', videoFile.name);
        await new Promise((resolve, reject) => {
            videoFile.arrayBuffer().then(buffer => {
                fs.writeFile(filePath, Buffer.from(buffer), (err) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
        });

        // Process the video file to extract transcript using GPT
        // (Implement your logic here)
        const transcription = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: fs.createReadStream(filePath)
        })

        // Delete the video file after processing
        // fs.unlinkSync(filePath);

        return NextResponse.json({ transcript: transcription.text });
    } catch (error) {
        // console.log("[VIDEO UPLOAD ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}