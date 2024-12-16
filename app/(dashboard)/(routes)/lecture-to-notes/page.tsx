"use client";
import * as z from "zod";
import { Heading } from '@/components/header'
import { MicrochipIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { YoutubeTranscript } from "youtube-transcript";

function LectureToNotesPage() {
    const router = useRouter();
    const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })
const isLoadig = form.formState.isSubmitting;
const onSubmit = async (values: z.infer<typeof formSchema>) => {
   
    YoutubeTranscript
    try {
        const response = await axios.post("/api/transcript", {
            videoUrl: values.prompt, // User's input from the form
        });

        if (response) {
            console.log("Transcript:", response);
            // Do something with the transcript, e.g., display it or process into notes
        } else {
            console.error("Error:", response);
            alert("Failed to fetch transcript.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the YouTube link.");
    }
};
//    try {
//     const userMessage: ChatCompletionMessageParam = {
//         role: "user",
//         content: values.prompt
//     };
//     const newMessages = [...messages, userMessage];

//     const response = await axios.post("/api/lecture-to-notes", {
//         messages: newMessages
//     });
//     setMessages((current) => [...current, userMessage, response.data]);
//     form.reset();
//    } catch (error: any) {
//     console.log(error);

//    }finally{
//     router.refresh();
//    }

  return (
    <div>
        <Heading
        title='Lecture to Notes'
        description='Convert your lectures to notes'
        icon={MicrochipIcon}
        iconColor='text-rose-500'
        bgColor='bg-rose-500/10'/>
        <div className='px-4 lg:px-8 '>
            <div>
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormField
            name="prompt"
            render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoadig}
                        placeholder="Hi"
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
    <div className="space-y-4 mt-4">
        <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) =>(
                <div key={typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}>
                    {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                </div>
            ))}
        </div>
    </div>
        </div>
    </div>
  )
}

export default LectureToNotesPage