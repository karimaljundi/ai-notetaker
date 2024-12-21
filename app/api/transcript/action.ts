import {TranscribeClient, StartTranscriptionJobCommand, LanguageCode} from '@aws-sdk/client-transcribe';

const transcribe = new TranscribeClient({region: process.env.AWS_BUCKET_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
});

export async function transcribeVideo(jobName: string, videoUrl: string) {
    const params = {
        TranscriptionJobName: jobName,
        LanguageCode: LanguageCode.EN_US, // Adjust based on your needs
        Media: {
            MediaFileUri: videoUrl
        },
        OutputBucketName: process.env.AWS_BUCKET_NAME!
    };

    const command = new StartTranscriptionJobCommand(params);
    const response = await transcribe.send(command);
    return response;
}
