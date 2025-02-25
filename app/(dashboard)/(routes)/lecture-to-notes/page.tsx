"use client";
import * as z from "zod";
import { Heading } from '@/components/header'
import { GraduationCap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';
import { Card } from "@/components/ui/card";


function LectureToNotesPage() {
    const router = useRouter();
    const {data: session} = useSession();
    const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>([]);


    const [notes, setNotes] = useState<any[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })
const isLoadig = form.formState.isSubmitting;
    useEffect(() => {
        if (session?.user?.email) {
            fetchNotes();
        }
    },[]);
    const fetchNotes = async () => {
        try {
            const response = await axios.get('/api/notes', {
                params: { email: session?.user?.email }
            });
            if (Array.isArray(response.data)) {
                setNotes(response.data); // Ensure response data is an array
            } else {
                console.error("Error: Notes data is not an array");
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };
const handleYouTubeSubmit = async (values: z.infer<typeof formSchema>) => {
   
    try {
        const response = await axios.post("/api/transcript", {
            userId: session?.user?.id,
            videoUrl: values.prompt, // User's input from the form
        });

        if (response) {
            try {
                const userMessage: ChatCompletionMessageParam = {
                    role: "user",
                    content: values.prompt
                };
                const newMessages = [...messages,userMessage];
                const startTime = performance.now();
                console.log("Transcript response", response);
                const openaiResponse = await axios.post("/api/lecture-to-notes", {
                    messages: newMessages, transcript: response.data.transcript, 
                });
                console.log("OpenAI response", openaiResponse.response);
                const endTime = performance.now();
                console.log(`API request took ${endTime - startTime} milliseconds`);
                setMessages((current) => [...current, 
                    userMessage,
                    openaiResponse.data
                    ]);
                const uniqueTitle = `Lecture Notes - ${uuidv4()}`;

                const noteResponse = await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: "create" ,email: session?.user?.email, title: uniqueTitle, content: openaiResponse.data}),
                });
                const noteResponseData = await noteResponse.json();
                console.log("Note added to database", noteResponseData);
                fetchNotes();
                form.reset();
               } catch (error: unknown) {
                console.error("Error:", error);
                alert("An error occurred while processing the transcript.");
               }finally{
                router.refresh();
               }
        } else {
            console.error("Error:", response);
            alert("Failed to fetch transcript.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the YouTube link.");
    }finally{
        router.refresh();
    }
};
return (
    <div>
        <Heading
        title='Lecture to Notes'
        description='Convert your lectures to notes'
        icon={GraduationCap}
        iconColor='text-rose-500'
        bgColor='bg-rose-500/10'/>
        <div className='px-4 lg:px-8 '>
            <div>  
     <Form {...form}>
        <form onSubmit={form.handleSubmit(handleYouTubeSubmit)}
        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormField
            name="prompt"
            render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoadig}
                        placeholder="Enter youtube URL"
                        {...field}/>
                    </FormControl>
                </FormItem>
            )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoadig}>
                Generate
            </Button>
        </form>

    </Form>
    </div>
    <div>
        {/* <VideoUpload onUpload={handleVideoUpload}/> */}
    </div>
    <div className="space-y-4 mt-4">
        {/* <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) =>(
                <div key={index}>
                    {typeof message === 'string' ? message : JSON.stringify(message)}
                </div>
            ))}
        </div> */}
    </div>
    <div className="mt-8">
                    <h2 className="text-xl font-bold">Your Notes</h2>
                    <ul>
                        {notes.map((note) => (
                            <Card key={note.title} className="border p-2 my-2">
                                <a href={`lecture-to-notes/${note.id}`} className="no-underline">
                                    <h3 className="font-bold">{note.title}</h3>
                                    <div className="overflow-hidden max-h-16">
                                        <p className="line-clamp-3">{note.content}</p>
                                    </div>
                                </a>
                            </Card>
                        ))}
                    </ul>
                </div>
        </div>
    </div>
  )
}

export default LectureToNotesPage