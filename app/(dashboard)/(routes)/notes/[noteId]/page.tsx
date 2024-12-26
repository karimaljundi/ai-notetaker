"use client";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { use, useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form';
import { formSchema } from '../../lecture-to-notes/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import Flashcard from '@/components/Flashcard';


function page({params}: {params: Promise<{ noteId: string }>}) {
    const [notes, setNotes] = useState<{ sections: any[] }>({ sections: [] });
    const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>([]);
    const [flashcards, setFlashcards] = React.useState<any[]>([]);
    
    const {noteId} = use(params)
    const {data: session} = useSession();
    const fetchNotes = async () => {
        try{
            const response = await axios.get('/api/notes', {
                params: { id: noteId }
            });
            console.log("response", response.data.content);
            console.log("response as an object", JSON.parse(response.data.content));
            setNotes(JSON.parse(response.data.content));
            const getFlashcards = await axios.get('/api/flashcards', {
                params: { id: noteId }
            });
            console.log("response", getFlashcards.data);
            setFlashcards(getFlashcards.data);
            
        }catch (error) {
            console.error("Error fetching notes:", error);
        }

    };
    useEffect(() => {
        fetchNotes();
    },[]);
        const form = useForm<z.infer<typeof formSchema>>({
            resolver:zodResolver(formSchema),
            defaultValues: {
                prompt: ""
            }
        });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("creating flashcards");
        try {
            const userMessage: ChatCompletionMessageParam = {
                                role: "user",
                                content: values.prompt
                            };
            const newMessages = [...messages,userMessage];

            const response = await axios.post('/api/notes-to-flashcards', {
                note: notes,
                messages: newMessages,
                prompt: values.prompt,
                email: session?.user?.email
            });
            console.log("Flashcards created:", response.data);
            console.log("Flashcards type:", typeof response.data);
            alert("Flashcards created successfully!");
            const noteResponse = await fetch('/api/create-flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: noteId, flashcards: response.data }),
            });
            const noteResponseData = await noteResponse.json();
            console.log("Flashcard added to database", noteResponseData);
        } catch (error) {
            console.error("Error creating flashcards:", error);
            alert("An error occurred while creating flashcards.");
        }
    };


    console.log("notes", notes.sections);
    const formatText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };
    
    return (
  
        <div className="p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
                <input
                    type="text"
                    {...form.register("prompt")}
                    placeholder="Enter prompt for flashcards"
                    className="border p-2 mb-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Flashcards"}
                </button>
            </form>
                <h2 className="text-3xl font-bold mb-4">{notes.title}</h2>
                {notes.sections.map((section: any, sectionIndex: number) => (
                    <div key={sectionIndex} className="mb-6">
                        <h3 className="text-2xl font-semibold mb-2">{section.title}</h3>
                        <ul className="list-disc list-inside mb-4">
                            {section.content.map((contentItem: string, contentIndex: number) => (
                                <li key={contentIndex} className="text-lg mb-1">{formatText(contentItem)}</li>
                            ))}
                        </ul>
                        {section.examples && (
                            <div className="mb-4">
                                <h4 className="text-xl font-medium mb-2">Examples:</h4>
                                {section.examples.map((example: any, exampleIndex: number) => (
                                    <div key={exampleIndex} className="mb-2">
                                        <p className="text-lg mb-1">{formatText(example.description)}</p>
                                        <ul className="list-disc list-inside">
                                            {example.details.map((detail: string, detailIndex: number) => (
                                                <li key={detailIndex} className="text-base mb-1">{formatText(detail)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                        {section.conclusion && <p className="text-lg font-semibold"><strong>Conclusion:</strong> {formatText(section.conclusion)}</p>}
                    </div>
                ))}
                    <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Flashcards</h2>
        <ul className="list-disc list-inside">
            {flashcards && flashcards.map((flashcard: any, flashcardIndex: number) => (
                    <Flashcard
                        key={flashcardIndex}
                        front={flashcard.question}
                        back={flashcard.answer}
                        difficulty={flashcard.difficulty}/>
            ))}
        </ul>
    </div>
        
    </div>
            )

    

}
export default page