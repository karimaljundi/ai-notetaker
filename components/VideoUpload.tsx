"use client";
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button"; // Adjust the import based on your UI library
import { getSignedURL } from '@/app/create/action';
import { transcribeVideo } from '@/app/api/transcript/action';
const VideoUpload = ({ onUpload }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fileURL, setFileURL] = useState<string | undefined>(undefined);

    const computeSHA256 = async (file: File) => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        return hashHex;
      };
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setStatusMessage("creating");
        setLoading(true);

        console.log({content, file})
        if (file){
            setStatusMessage("uploading");
            const checkSum = await computeSHA256(file);
            const signedURLResult = await getSignedURL(file.type, file.size, checkSum);
            if (signedURLResult.failure!=undefined){
                setStatusMessage("failed");
                setLoading(false);
                console.log("error")
            }
            const url = signedURLResult.success?.url;
            await fetch(url!, {method: "PUT", body: file, headers: {"Content-Type": file.type},});
            console.log(url);
            const jobName = `transcription-${Array.from(crypto.getRandomValues(new Uint8Array(8)), byte => byte.toString(16).padStart(2, '0')).join('')}`;
            const transcription = await transcribeVideo(jobName, url!);
            setStatusMessage("created");
            setLoading(false);
            console.log('transcription created',transcription );
        }
        
    };
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
    if (fileURL) {
        URL.revokeObjectURL(fileURL);
    }
    if (file) {
        const url = URL.createObjectURL(file);
        setFileURL(url);
    }else{
        setFileURL(undefined);
    }
    
 };


    return (
        <div>
            <input 
            type="file" 
            accept="video/mp4,video/webm,video/ogg,audio/mpeg,audio/ogg,audio/wav,audio/mp3"
            onChange={handleChange}
            ref={fileInputRef}
            />
            <Button onClick={handleSubmit}>
            Upload Video
            </Button>

            {fileURL && file && (
            <div className='flex gap-4 items-center'>
                {file.type.includes('video/') || file.type.includes('audio/') ? (
                <div className='rounded-lg overflow-hidden w-74 h-74 relative'>
                    <video className='object-cover' controls src={fileURL} autoPlay loop muted/>
                </div>
                ) : (
                <div className="text-red-500">
                    Invalid file type. Please upload a video or audio file.
                </div>
                )}
            </div>
            )}
        </div>
    );
};

export default VideoUpload;