from youtube_transcript_api import YouTubeTranscriptApi as yta
import sys

def get_transcript(vid_url):
    try:
        # Extract video ID from the URL
        if "youtu.be" in vid_url:
            vid_id = vid_url.split('/')[-1]
        elif "youtube.com" in vid_url:
            vid_id = vid_url.split('v=')[-1].split('&')[0]
        else:
            raise ValueError("Invalid YouTube URL")

        data = yta.get_transcript(vid_id)

        final_data = ''
        for val in data:
            final_data += val['text'] + ' '  # Concatenate text with a space

        return final_data.strip()  # Return cleaned transcript
    except Exception as e:
        print(e)
        return None

if __name__ == "__main__":
    # Get the YouTube URL from command line arguments
    if len(sys.argv) > 1:
        youtube_url = sys.argv[1]
        transcript = get_transcript(youtube_url)
        if transcript:
            print(transcript)
        else:
            print("Failed to retrieve transcript.")
    else:
        print("No YouTube URL provided.")