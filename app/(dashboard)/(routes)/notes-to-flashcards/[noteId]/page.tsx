'use client'
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import Flashcard from '@/components/Flashcard';
import { useRouter } from 'next/navigation';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '../../lecture-to-notes/constants';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Save, Wand2 } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';


function FlashcardsPage({params}: {params: Promise<{ noteId: string }>}) {
    const {data: session, status, update} = useSession();
    const { noteId } = use(params);
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '', difficulty: 'easy' });
    const [notes, setNotes] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        fetchFlashcards(); fetchNotes();
    }, [noteId]);
    const currentFlashcard = flashcards[currentIndex];

const form = useForm<z.infer<typeof formSchema>>({
            resolver:zodResolver(formSchema),
            defaultValues: {
                prompt: ""
            }
        });
    const fetchFlashcards = async () => {
        try {
            const getFlashcards = await axios.get('/api/flashcards', {
                params: { id: noteId }
            });
            console.log("response", getFlashcards.data);
            setFlashcards(getFlashcards.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        }
    };
    const fetchNotes = async () => {
        try{
            const response = await axios.get('/api/notes', {
                params: { id: noteId }
            });
            console.log("response", response.data.content);
            setNotes(JSON.parse(response.data.content));
            
        }catch (error) {
            console.error("Error fetching notes:", error);
        }
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setIsFlipped(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleEdit = (index: number) => {
        setEditMode(true);
        setCurrentIndex(index);
    };
const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    console.log("creating flashcards");
    try {
        const userMessage: ChatCompletionMessageParam = {
                            role: "user",
                            content: values.prompt
                        };
        const newFlashcards = [...flashcards, userMessage];
        
        const response = await axios.post('/api/notes-to-flashcards', {
            note: notes,
            messages: newFlashcards,
            prompt: values.prompt
        });
        console.log("Flashcards generated:", response.data);
        console.log("Flashcards type:", typeof response.data);
        alert("Flashcards created successfully!");
        const noteResponse = await fetch('/api/create-flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId, flashcards: response.data }),
        });
        const noteResponseData = await noteResponse.json();
        console.log("Flashcard added to database", noteResponseData);
        fetchFlashcards();
    } catch (error) {
        console.error("Error creating flashcards:", error);
        alert("An error occurred while creating flashcards.");
}finally {
    router.refresh();
}
}
    const handleSave = async () => {
        try {
            const updatedFlashcard = flashcards[currentIndex];
            await axios.put(`/api/flashcards`, {
              params: { id: updatedFlashcard.id, flashcard: updatedFlashcard }
            });
            
            // console.log("Flashcard updated in database", noteResponseData);
            setEditMode(false);
        } catch (error) {
            console.error("Error updating flashcard:", error);
        }
    };

    const handleDelete = async (index: number) => {
        try {
            const flashcardToDelete = flashcards[index];
            await axios.delete("/api/flashcards" ,{
              params: { id: flashcardToDelete.id } 
            });
            setFlashcards(flashcards.filter((_, i) => i !== index));
            setCurrentIndex(0);
            setIsFlipped(false);
            fetchFlashcards();
        } catch (error) {
            console.error("Error deleting flashcard:", error);
        }
    };

    const handleCreate = async () => {
        try {
          console.log("Flashcards:", newFlashcard);
          console.log("Flashcards typeof:", typeof newFlashcard);
          setLoading(true);
          const noteResponse = await fetch('/api/flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId, flashcards: newFlashcard }),
        });
        const noteResponseData = await noteResponse.json();
            setFlashcards([...flashcards, noteResponseData]);
            console.log("Flashcard added to database", noteResponseData);
            setNewFlashcard({ question: '', answer: '', difficulty: 'easy' });
            await update({});
            router.refresh()
            console.log("LIMIT AFTER:", session);
            fetchFlashcards();
        } catch (error) {
            console.error("Error creating flashcard:", error);
        }
    };
    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Flashcards</CardTitle>
                        <CardDescription>Loading your study materials...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Preparing your flashcards</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!flashcards || flashcards.length === 0) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <Card className="w-full mb-6">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Create Your First Flashcard</CardTitle>
                        <CardDescription>Get started with your study materials</CardDescription>
                    </CardHeader>
                    // In the return statement, modify the CardContent section like this:
<CardContent className="p-4">
    <div className="flex flex-col gap-4">
        {/* Flashcard container */}
        <div className="w-full max-w-2xl mx-auto">
            <Flashcard
                front={currentFlashcard.question}
                back={currentFlashcard.answer}
                difficulty={currentFlashcard.difficulty}
                isFlipped={isFlipped}
                onFlip={handleFlip}
            />
        </div>

        {/* Navigation buttons below the flashcard */}
        <div className="flex justify-center gap-4 mt-4">
            <Button
                variant="outline"
                onClick={handlePrev}
                className="w-[60px] h-[36px] px-2"
            >
                <ChevronLeft className="h-4 w-4" /> Prev
            </Button>

            <Button
                variant="outline"
                onClick={handleNext}
                className="w-[60px] h-[36px] px-2"
            >
                Next <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    </div>
</CardContent>

                </Card>
            </div>
        );
    }
    
    

    console.log("currentFlashcard", currentFlashcard);
    
    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Flashcards</CardTitle>
                    <div className="text-sm text-muted-foreground">
                        Card {currentIndex + 1} of {flashcards.length}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        className="w-[65px]"
                    >
                        <ChevronLeft className="mr-2" /> Prev
                    </Button>

                    <div className="w-full max-w-2xl mx-auto">
                        <Flashcard
                            front={currentFlashcard.question}
                            back={currentFlashcard.answer}
                            difficulty={currentFlashcard.difficulty}
                            isFlipped={isFlipped}
                            onFlip={handleFlip}
                        />
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleNext}
                        className="w-[65px]"
                    >
                        Next <ChevronRight className="ml-2" />
                    </Button>
                </div>
            </CardContent>
            </Card>
            <Tabs defaultValue="edit" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit">Edit Current</TabsTrigger>
                <TabsTrigger value="create">Create New</TabsTrigger>
                <TabsTrigger value="generate">Generate</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <Input
                                value={currentFlashcard.question}
                                onChange={(e) => setFlashcards(flashcards.map((fc, i) => 
                                    i === currentIndex ? { ...fc, question: e.target.value } : fc
                                ))}
                                placeholder="Question"
                            />
                            <Input
                                value={currentFlashcard.answer}
                                onChange={(e) => setFlashcards(flashcards.map((fc, i) => 
                                    i === currentIndex ? { ...fc, answer: e.target.value } : fc
                                ))}
                                placeholder="Answer"
                            />
                            <Select
                                value={currentFlashcard.difficulty}
                                onValueChange={(value) => setFlashcards(flashcards.map((fc, i) => 
                                    i === currentIndex ? { ...fc, difficulty: value } : fc
                                ))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="flex-1">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                                <Button onClick={() => handleDelete(currentIndex)} variant="destructive" className="flex-1">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="create">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <Input
                                placeholder="Question"
                                value={newFlashcard.question}
                                onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                            />
                            <Input
                                placeholder="Answer"
                                value={newFlashcard.answer}
                                onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                            />
                            <Select
                                value={newFlashcard.difficulty}
                                onValueChange={(value) => setNewFlashcard({ ...newFlashcard, difficulty: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleCreate} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Create Flashcard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="generate">
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-4">
                            <Input
                                {...form.register("prompt")}
                                placeholder="Enter prompt to generate flashcards..."
                            />
                            <Button type="submit" className="w-full">
                                <Wand2 className="mr-2 h-4 w-4" /> Generate Flashcards
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
    );
            {/* <Tabs defaultValue="edit" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit Current Flashcard</TabsTrigger>
                    <TabsTrigger value="create">Create New Flashcard</TabsTrigger>
                </TabsList>
    
                <TabsContent value="edit">
                    <Card>
                        <CardContent className="pt-6">
                            {editMode ? (
                                <div className="space-y-4">
                                    <Input
                                        value={currentFlashcard.question}
                                        onChange={(e) => setFlashcards(flashcards.map((fc, i) => 
                                            i === currentIndex ? { ...fc, question: e.target.value } : fc
                                        ))}
                                        placeholder="Edit question"
                                    />
                                    <Input
                                        value={currentFlashcard.answer}
                                        onChange={(e) => setFlashcards(flashcards.map((fc, i) => 
                                            i === currentIndex ? { ...fc, answer: e.target.value } : fc
                                        ))}
                                        placeholder="Edit answer"
                                    />
                                    <Select
                                        value={currentFlashcard.difficulty}
                                        onValueChange={(value) => setFlashcards(flashcards.map((fc, i) => 
                                            i === currentIndex ? { ...fc, difficulty: value } : fc
                                        ))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleSave} className="w-full">
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(currentIndex)} variant="outline" className="w-full">
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Flashcard
                                    </Button>
                                    <Button onClick={() => handleDelete(currentIndex)} variant="destructive" className="w-full">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Flashcard
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
    
                {/* Continue with Create tab and Generate section similar to quiz page */}
        //     </Tabs> */}
        // </div>
    // );
}

export default FlashcardsPage;