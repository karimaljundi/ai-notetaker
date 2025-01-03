'use client'
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import QuizQuestion from '@/components/QuizQuestion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Plus, Minus, Edit2, Trash2, Save, Wand2, Check } from "lucide-react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../../lecture-to-notes/constants';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';
import { useRouter } from 'next/navigation';


function FlashcardsPage({params}: {params: Promise<{ noteId: string }>}) {
    const { noteId } = use(params);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [newQuiz, setNewQuiz] = useState<{ question: string; correctAnswer: string; answers: string[] }>({ question: '', correctAnswer: '', answers: [] });
    const [notes, setNotes] = useState();
    const [loading, setLoading] = useState(true);
    const [quizResults, setQuizResults] = useState<{[key: number]: boolean | null}>({});
    const [attemptedQuestions, setAttemptedQuestions] = useState<Set<number>>(new Set());
    const router = useRouter();
    interface QuizAnswer {
        questionIndex: number;
        selectedAnswer: string;
        feedback: string;
      }
      
      // Add to your state declarations
      const [quizAnswers, setQuizAnswers] = useState<Record<number, QuizAnswer>>({});
      
      // Update handleAnswerSubmission
      const handleAnswerSubmission = (questionIndex: number, isCorrect: boolean) => {
        const answer = {
          questionIndex,
          selectedAnswer: currentQuiz.answers[questionIndex],
          feedback: isCorrect ? "Correct! Great job." : `Wrong! The correct answer was: ${currentQuiz.correctAnswer}`
        };
        setQuizAnswers(prev => ({...prev, [questionIndex]: answer}));
        setQuizResults(prev => ({ ...prev, [questionIndex]: isCorrect }));
        setAttemptedQuestions(prev => new Set(prev.add(questionIndex)));
      };
    
    
    useEffect(() => {
        fetchQuizzes(); fetchNotes();
    }, [noteId]);
const form = useForm<z.infer<typeof formSchema>>({
            resolver:zodResolver(formSchema),
            defaultValues: {
                prompt: ""
            }
        });

    
        const calculateScore = () => {
            const attempted = Array.from(attemptedQuestions);
            const correct = attempted.filter(index => quizResults[index] === true).length;
            return {
                attempted: attempted.length,
                correct,
                percentage: attempted.length > 0 ? Math.round((correct / attempted.length) * 100) : 0
            };
        };
    const fetchQuizzes = async () => {
        try {
            const getQuizzes = await axios.get('/api/quizzes', {
                params: { id: noteId}
            });
            console.log("quizzes response:", getQuizzes.data);
            setQuizzes(JSON.parse(getQuizzes.data));
            setLoading(false);
            
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            setLoading(false);
        }
    };
    const fetchNotes = async () => {
        try{
            const response = await axios.get('/api/notes', {
                params: { id: noteId }
            });
            // console.log("response", response.data.content);
            setNotes(JSON.parse(response.data.content));
            
        }catch (error) {
            console.error("Error fetching notes:", error);
        }
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quizzes.length);
        // setIsFlipped(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + quizzes.length) % quizzes.length);
        // setIsFlipped(false);
    };

    const handleEdit = (index: number) => {
        setEditMode(true);
        setCurrentIndex(index);
    };
const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    console.log("generating quizzes");
    try {
        const userMessage: ChatCompletionMessageParam = {
                            role: "user",
                            content: values.prompt
                        };
        const newQuizzes = [...quizzes, userMessage];
        
        const response = await axios.post('/api/notes-to-quizzes', {
            note: notes,
            messages: newQuizzes,
            prompt: values.prompt
        });
        console.log("Quizzes generated:", response.data);
        console.log("Quizzes type:", typeof response.data);
        alert("Quizzes created successfully!");
        const noteResponse = await fetch('/api/create-quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId, quiz: response.data }),
        });
        const noteResponseData = await noteResponse.json();
        console.log("Flashcard added to database", noteResponseData);
        fetchQuizzes();
    } catch (error) {
        console.error("Error creating quizzes:", error);
        alert("An error occurred while creating quizzes.");
    
}finally{
    router.refresh();
}
}
const handleSave = async () => {
        try {
            const updatedQuiz = quizzes[currentIndex];
            console.log("Updated quiz:", updatedQuiz);
            const quizResponse = await axios.put(`/api/quizzes`, {
              params: { id: updatedQuiz.id, quiz: updatedQuiz }
            });
            console.log("Quiz updated in database", quizResponse.data);
            setEditMode(false);
        } catch (error) {
            console.error("Error updating flashcard:", error);
        }
};
const handleRemoveOption = (index: number, isNewQuiz: boolean = false) => {
    if (isNewQuiz) {
        const updatedAnswers = [...newQuiz.answers];
        updatedAnswers.splice(index, 1);
        setNewQuiz({ ...newQuiz, answers: updatedAnswers });
    } else {
        const updatedAnswers = [...currentQuiz.answers];
        updatedAnswers.splice(index, 1);
        setQuizzes(quizzes.map((q, i) => 
            i === currentIndex ? { ...q, answers: updatedAnswers } : q
        ));
    }
};
const handleDelete = async (index: number) => {
        try {
            const quizToDelete = quizzes[index];
            await axios.delete("/api/quizzes" ,{
              params: { id: quizToDelete.id } 
            });
            setQuizzes(quizzes.filter((_, i) => i !== index));
            setCurrentIndex(0);
            // setIsFlipped(false);
            fetchQuizzes();
        } catch (error) {
            console.error("Error deleting flashcard:", error);
        }
};

    const handleCreate = async () => {
        try {
          console.log("Quizzes:", newQuiz);
          console.log("Flashcards typeof:", typeof newQuiz);
          const noteResponse = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId, quiz: newQuiz }),
        });
        const noteResponseData = await noteResponse.json();
        console.log("Flashcard added to database", noteResponseData);
            setQuizzes([...quizzes, noteResponseData]);
            setNewQuiz({ question: '', correctAnswer: '', answers: [] });
            fetchQuizzes();
            // window.location.reload();
        } catch (error) {
            console.error("Error creating flashcard:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-xl">Loading quizzes...</div>
            </div>
        );
    }
    if (!quizzes || quizzes.length === 0) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <Card className="w-full mb-6">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Create Your First Quiz</CardTitle>
                        <CardDescription>Add questions and multiple choice answers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="create">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="create">Create Manually</TabsTrigger>
                                <TabsTrigger value="generate">Generate with AI</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="create" className="space-y-4">
                                <Input
                                    placeholder="Question"
                                    value={newQuiz.question}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                                />
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">Answer Options</h4>
                                        {newQuiz.answers.length < 6 && (
                                            <Button
                                                onClick={() => setNewQuiz({ 
                                                    ...newQuiz, 
                                                    answers: [...newQuiz.answers, ''] 
                                                })}
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Option
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {newQuiz.answers.map((answer, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                value={answer}
                                                onChange={(e) => {
                                                    const newAnswers = [...newQuiz.answers];
                                                    newAnswers[index] = e.target.value;
                                                    setNewQuiz({ ...newQuiz, answers: newAnswers });
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (newQuiz.answers.length > 2) {
                                                        const newAnswers = newQuiz.answers.filter((_, i) => i !== index);
                                                        setNewQuiz({ 
                                                            ...newQuiz, 
                                                            answers: newAnswers,
                                                            correctAnswer: newQuiz.correctAnswer === answer ? '' : newQuiz.correctAnswer 
                                                        });
                                                    }
                                                }}
                                                disabled={newQuiz.answers.length <= 2}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={newQuiz.correctAnswer === answer ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setNewQuiz({ ...newQuiz, correctAnswer: answer })}
                                            >
                                                {newQuiz.correctAnswer === answer ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    "Set Correct"
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
    
                                <Button 
                                    onClick={handleCreate} 
                                    className="w-full"
                                    disabled={!newQuiz.question || !newQuiz.correctAnswer || newQuiz.answers.some(a => !a)}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Create Quiz
                                </Button>
                            </TabsContent>
    
                            <TabsContent value="generate" className="space-y-4">
                                <form onSubmit={form.handleSubmit(handleGenerate)}>
                                    <Input
                                        {...form.register("prompt")}
                                        placeholder="Enter prompt to generate quiz questions..."
                                    />
                                    <Button type="submit" className="w-full mt-4">
                                        <Wand2 className="mr-2 h-4 w-4" /> Generate Quiz
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        );
    }
    const currentQuiz = quizzes[currentIndex];
    const score = calculateScore();

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-3xl font-bold">Quiz Management</CardTitle>
                            <CardDescription>Note ID: {noteId}</CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                                Question {currentIndex + 1} of {quizzes.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Attempted: {score.attempted} | Correct: {score.correct}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-8">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="mr-2" /> Previous
                        </Button>

                        <div className="flex-1">
                        <QuizQuestion
  question={currentQuiz.question}
  answers={currentQuiz.answers}
  correctAnswer={currentQuiz.correctAnswer}
  selectedAnswer={quizAnswers[currentIndex]?.selectedAnswer || ""}
  feedback={quizAnswers[currentIndex]?.feedback || ""}
  onAnswer={(isCorrect: boolean) => handleAnswerSubmission(currentIndex, isCorrect)}
  key={currentIndex}
/>
                        </div>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleNext}
                        >
                            Next <ChevronRight className="ml-2" />
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={() => {
                            const score = calculateScore();
                            alert(`Quiz Complete!\n\nAttempted: ${score.attempted} questions\nCorrect: ${score.correct}\nScore: ${score.percentage}%`);
                        }}
                        variant="default"
                        className="flex items-center"
                    >
                        <Check className="mr-2 h-4 w-4" /> Finish Quiz
                    </Button>
                </CardFooter>
            </Card>

            <Tabs defaultValue="edit" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit Current Quiz</TabsTrigger>
                    <TabsTrigger value="create">Create New Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="edit">
                    <Card>
                        <CardContent className="pt-6">
                            {editMode ? (
                                <div className="space-y-4">
                                    <Input
                                        value={currentQuiz.question}
                                        onChange={(e) => setQuizzes(quizzes.map((q, i) => 
                                            i === currentIndex ? { ...q, question: e.target.value } : q
                                        ))}
                                        placeholder="Edit question"
                                    />
                                    <Input
                                        value={currentQuiz.correctAnswer}
                                        onChange={(e) => setQuizzes(quizzes.map((q, i) => 
                                            i === currentIndex ? { ...q, correctAnswer: e.target.value } : q
                                        ))}
                                        placeholder="Edit correct answer"
                                    />
                                    {currentQuiz.answers.map((answer: string, index: number) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={answer}
                                                onChange={(e) => {
                                                    const updatedAnswers = [...currentQuiz.answers];
                                                    updatedAnswers[index] = e.target.value;
                                                    setQuizzes(quizzes.map((q, i) => 
                                                        i === currentIndex ? { ...q, answers: updatedAnswers } : q
                                                    ));
                                                }}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                onClick={() => handleRemoveOption(index)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={() => setQuizzes(quizzes.map((q, i) => 
                                                i === currentIndex ? { ...q, answers: [...q.answers, ''] } : q
                                            ))}
                                            variant="outline"
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Option
                                        </Button>
                                        <Button onClick={handleSave} className="w-full">
                                            <Save className="mr-2 h-4 w-4" /> Save Changes
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(currentIndex)} variant="outline" className="w-full">
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Quiz
                                    </Button>
                                    <Button onClick={() => handleDelete(currentIndex)} variant="destructive" className="w-full">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Quiz
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <Input
                                    value={newQuiz.question}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                                    placeholder="New question"
                                />
                                <Input
                                    value={newQuiz.correctAnswer}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, correctAnswer: e.target.value })}
                                    placeholder="Correct answer"
                                />
                                {newQuiz.answers.map((answer, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={answer}
                                            onChange={(e) => {
                                                const updatedAnswers = [...newQuiz.answers];
                                                updatedAnswers[index] = e.target.value;
                                                setNewQuiz({ ...newQuiz, answers: updatedAnswers });
                                            }}
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            onClick={() => handleRemoveOption(index, true)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={() => setNewQuiz({ ...newQuiz, answers: [...newQuiz.answers, ''] })}
                                        variant="outline"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Option
                                    </Button>
                                    <Button onClick={handleCreate} className="w-full">
                                        Create Quiz
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Generate Quizzes</CardTitle>
                    <CardDescription>Use AI to generate quizzes from your notes</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleGenerate)} className="flex gap-2">
                        <Input
                            {...form.register("prompt")}
                            placeholder="Enter prompt for quizzes"
                        />
                        <Button type="submit">
                            <Wand2 className="mr-2 h-4 w-4" /> Generate
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default FlashcardsPage;