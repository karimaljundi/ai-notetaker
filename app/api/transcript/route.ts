import { NextResponse } from "next/server";
// import { YoutubeTranscript } from "youtube-transcript"; 
// import InnerTube, TranscriptInfo  from "youtubei.js";
import TranscriptInfo from 'youtubei.js'
import he from "he";
import fs from 'fs';
import path from 'path';
export async function POST(req: Request, userId: string) {
    try {
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
        // const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        // const cleanedTranscript = transcript.map(item => {
        //     return {
        //         ...item,
        //         text: he.decode(item.text) // Decode HTML entities
        //             .replace(/&amp;#39;/g, "'") // Replace specific unwanted characters
        //             .replace(/\s+/g, ' ') // Normalize whitespace
        //             .trim() // Trim leading/trailing whitespace
        //     };
        // });
        // for (let i = 0; i < cleanedTranscript.length; i++) {
        //     compiledTranscript += cleanedTranscript[i].text + " ";
        // }

        // const transcriptDir = path.join(__dirname, 'transcripts');
        // if (!fs.existsSync(transcriptDir)) {
        //     fs.mkdirSync(transcriptDir);
        // }
        // const transcriptFilePath = path.join(transcriptDir, `transcript_${videoId}.txt`);
        // fs.writeFileSync(transcriptFilePath, compiledTranscript);
        const transcript1 = transcript.transcript.content?.body?.initial_segments;
        transcript1?.forEach((segment: any) => {
            compiledTranscript+=segment.snippet.text;
        });
        // console.log(transcript1);
        return NextResponse.json(compiledTranscript); // Return the cleaned transcript as JSON
    } catch (error) {
        console.log("[TRANSCRIPT ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}