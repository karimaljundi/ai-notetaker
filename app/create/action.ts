"use server";
import { auth } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const acceptedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp3'];
const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB

export async function getSignedURL(type: string, size: number, checkSum: string) {
    const session = await auth();
    if (!session) {
        return { failure: "Unauthorized" };
    }

    if (!acceptedTypes.includes(type)) {
        return { failure: "Invalid file type" };
    }

    if (size > maxFileSize) {
        return { failure: "File size exceeds the maximum limit of 2GB" };
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${crypto.randomBytes(16).toString("hex")}`, // Generate a unique file name
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checkSum,
        Metadata: {
            userId: session.userId || ''
        }
    });

    const signedURL = await getSignedUrl(s3, putObjectCommand, { expiresIn: 3600 });
    return { success: { url: signedURL } };
}