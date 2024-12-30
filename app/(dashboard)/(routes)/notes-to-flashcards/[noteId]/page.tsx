'use client'
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import Flashcard from '@/components/Flashcard';
import { useRouter } from 'next/router';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '../../lecture-to-notes/constants';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { zodResolver } from '@hookform/resolvers/zod';

function FlashcardsPage({params}: {params: Promise<{ noteId: string }>}) {
    const { noteId } = use(params);
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '', difficulty: 'easy' });
    const [notes, setNotes] = useState();
    useEffect(() => {
        fetchFlashcards(); fetchNotes();
    }, [noteId]);
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
    
};
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
          const noteResponse = await fetch('/api/create-flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId, flashcards: [newFlashcard] }),
        });
        const noteResponseData = await noteResponse.json();
            setFlashcards([...flashcards, noteResponseData]);
            console.log("Flashcard added to database", noteResponseData);
            setNewFlashcard({ question: '', answer: '', difficulty: 'easy' });
            fetchFlashcards();
        } catch (error) {
            console.error("Error creating flashcard:", error);
        }
    };

    if (flashcards.length === 0) {
        return (<div>
          <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Create New Flashcard</h3>
                <input
                    type="text"
                    value={newFlashcard.question}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                    className="border p-2 mb-2 w-full"
                    placeholder="New question"
                />
                <input
                    type="text"
                    value={newFlashcard.answer}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                    className="border p-2 mb-2 w-full"
                    placeholder="New answer"
                />
                <select
                    value={newFlashcard.difficulty}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}
                    className="border p-2 mb-2 w-full"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button onClick={handleCreate} className="bg-green-500 text-white py-2 px-4 rounded">Create</button>
            </div>


<form onSubmit={form.handleSubmit(handleGenerate)} className="mb-4">
                <input
                    type="text"
                    {...form.register("prompt")}
                    placeholder="Enter prompt for flashcards"
                    className="border p-2 mb-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                    
                >Generate Flashcards
                </button>
            </form>
        </div> );
    }

    const currentFlashcard = flashcards[currentIndex];
    
    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">Flashcards for Note {noteId}</h2>
            <div className="flex justify-center items-center mb-4">
                <button onClick={handlePrev} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">Previous</button>
                <Flashcard
                    front={currentFlashcard.question}
                    back={currentFlashcard.answer}
                    difficulty={currentFlashcard.difficulty}
                />
                <button onClick={handleNext} className="bg-gray-500 text-white py-2 px-4 rounded ml-2">Next</button>
            </div>
            {editMode ? (
                <div className="mb-4">
                    <input
                        type="text"
                        value={currentFlashcard.question}
                        onChange={(e) => setFlashcards(flashcards.map((fc, i) => i === currentIndex ? { ...fc, question: e.target.value } : fc))}
                        className="border p-2 mb-2 w-full"
                        placeholder="Edit question"
                    />
                    <input
                        type="text"
                        value={currentFlashcard.answer}
                        onChange={(e) => setFlashcards(flashcards.map((fc, i) => i === currentIndex ? { ...fc, answer: e.target.value } : fc))}
                        className="border p-2 mb-2 w-full"
                        placeholder="Edit answer"
                    />
                    <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
                </div>
            ) : (
                <button onClick={() => handleEdit(currentIndex)} className="bg-yellow-500 text-white py-2 px-4 rounded mb-4">Edit</button>
            )}
            <button onClick={() => handleDelete(currentIndex)} className="bg-red-500 text-white py-2 px-4 rounded mb-4">Delete</button>
            <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Create New Flashcard</h3>
                <input
                    type="text"
                    value={newFlashcard.question}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                    className="border p-2 mb-2 w-full"
                    placeholder="New question"
                />
                <input
                    type="text"
                    value={newFlashcard.answer}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                    className="border p-2 mb-2 w-full"
                    placeholder="New answer"
                />
                <select
                    value={newFlashcard.difficulty}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}
                    className="border p-2 mb-2 w-full"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button onClick={handleCreate} className="bg-green-500 text-white py-2 px-4 rounded">Create</button>
            </div>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="mb-4">
                <input
                    type="text"
                    {...form.register("prompt")}
                    placeholder="Enter prompt for flashcards"
                    className="border p-2 mb-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                    
                >Generate Flashcards
                </button>
            </form>
        </div>
    );
}

export default FlashcardsPage;