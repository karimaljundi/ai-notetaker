import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { YoutubeTranscript } from "youtube-transcript"; // Ensure you have this package installed

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { videoUrl } = body; // Expecting videoUrl from the request body

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!videoUrl) {
            return new NextResponse("YouTube URL not provided", { status: 400 });
        }

        // Fetch the transcript using the provided video URL
        const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        return NextResponse.json(transcript); // Return the transcript as JSON
    } catch (error) {
        console.log("[TRANSCRIPT ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}