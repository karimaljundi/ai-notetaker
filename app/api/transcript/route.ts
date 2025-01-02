import { NextResponse } from "next/server";
import TranscriptInfo from 'youtubei.js'
import { auth } from "@/auth";
import he from "he";
import fs from 'fs';
import path from 'path';
export async function POST(req: Request, userId: string) {
    try {
        const session = await auth();
        const body = await req.json();
        const { videoUrl } = body; // Expecting videoUrl from the request body
        let compiledTranscript = "";
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!videoUrl) {
            return new NextResponse("YouTube URL not provided", { status: 400 });
        }

        // Fetch the transcript using the provided video URL
        const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
        const yt = await TranscriptInfo.create()
        const video = await yt.getInfo(videoId)
        const transcript = await video.getTranscript();
        
        const transcript1 = transcript.transcript.content?.body?.initial_segments;
        transcript1?.forEach((segment: any) => {
            compiledTranscript+=segment.snippet.text;
        });
        const transcriptWithContext = {
            userId: session.id,
            timestamp: new Date().toISOString(),
            transcript: compiledTranscript
        };
        console.log("Transcript with context", transcriptWithContext);
        return NextResponse.json(transcriptWithContext);

    } catch (error) {
        return new NextResponse("[TRANSCRIPT ERROR]", { status: 500});
    }
}