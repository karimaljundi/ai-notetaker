
import { MAX_FREE_COUNTS } from '@/constants';
import prisma from './prismadb';


export async function addNote(title: string, content: string, email: string) {

    const findNote = await prisma.note.findFirst({
        where: {
            email, title,content
        }
    })
    console.log("foundnotes", findNote)
    if (!findNote){
        const note = await prisma.note.create({
            data: {
                title,
                content,
                email,
            },
        });
        console.log("successfully created note")
        return JSON.stringify(note);
    }
    else{
        return JSON.stringify({error: "Note already exists"});
    }
    
}
export async function getNotesByEmail(email: string){
   try{const notes = await prisma.note.findMany({
        where: {
            email: email
        }
    });
    // console.log("Notes retrieved from database");
    return JSON.stringify(notes);
}
    catch{
        return JSON.stringify({error: "No notes have been generated by this user"});
    }
}
export async function getNoteById(id: string){
    const note = await prisma.note.findUnique({
        where: {
            id: id
        }
    });
    return JSON.stringify(note);
}
export async function addFlashcards(noteId: string, flashcards: any) {
    console.log("noteId", noteId);
    console.log("flashcards type", typeof flashcards);

    let flashcardArray;
    if (typeof flashcards === 'string') {
        try {
            flashcardArray = JSON.parse(flashcards);
            console.log('flashcards type after parsing:', typeof flashcardArray);
        } catch (error) {
            console.error("Error parsing flashcards:", error);
            throw new Error("Invalid flashcards format");
        }
    } else {
        flashcardArray = flashcards;
    }

    try {
        const manyFlashcards = await prisma.flashcard.createMany({
            data: flashcardArray['flashcards'].map((flashcard: any) => ({
                question: flashcard.question,
                answer: flashcard.answer,
                difficulty: flashcard.difficulty,
                noteId: noteId
            }))
        });
        console.log("Flashcards created successfully:", manyFlashcards);
        const note = await prisma.note.findUnique({
            where: {
                id: noteId
            },
            include: {
                flashcards: true
            }
        });
        console.log("Updated note with flashcards:", note);
        return JSON.stringify(note);
    } catch (error) {
        console.error("Error adding flashcards:", error);
        throw error;
    }
}
export async function addFlashcard(noteId: string, flashcard: any) {
    try {
        console.log("Creating flashcard:", flashcard);
        const newFlashcard = await prisma.flashcard.create({
            data: {
                ...flashcard,
                noteId
            }
        });
        console.log("Flashcard created successfully:", newFlashcard);
        return JSON.stringify(newFlashcard);
    } catch (error) {
        console.error("Error creating flashcard:", error);
        throw error;
    }
}
export async function getFlashcardsByNoteId(id: string){
    const flashcards = await prisma.flashcard.findMany({
        where: {
            noteId: id
        }
    });
    return JSON.stringify(flashcards);
}
export async function updateNoteById(id: string, flashcards: any) {
    try {
        console.log("Updating note with flashcards:", flashcards);
        const updatedFlashcards = await prisma.flashcard.createMany({
            data: flashcards.map((flashcard: any) => ({
                ...flashcard,
                noteId: id
            }))
        });
        console.log("Flashcards created successfully:", updatedFlashcards);
        const note = await prisma.note.findUnique({
            where: {
                id: id
            },
            include: {
                flashcards: true
            }
        });
        console.log("Note updated successfully:", note);
        return JSON.stringify(note);
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
}
export async function deleteFlashcardById(id: string){
    try {
        const flashcard = await prisma.flashcard.delete({
            where: {
                id: id
            }
        });
        console.log("Flashcard deleted successfully:", flashcard);
        return JSON.stringify(flashcard);
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        throw error;
    }
}
export async function updateFlashcardById(id: string, flashcard: any){
    try {
        
        const updatedFlashcard = await prisma.flashcard.update({
            where: {
                id: id
            },
            data: {
                ...flashcard
            }
        });
        console.log("Flashcard updated successfully:", updatedFlashcard);
        return JSON.stringify(updatedFlashcard);
        
    } catch (error) {
        
    }
}
export async function getQuizzesByNoteId(id: string){
    const quizzes = await prisma.quiz.findMany({
        where: {
            noteId: id
        }
    });
    return JSON.stringify(quizzes);
}

export async function addQuizzes(noteId: string, quizzes: any) {
    console.log("noteId", noteId);
    console.log("flashcards type", typeof quizzes);

    let quizzesArray;
    if (typeof quizzes === 'string') {
        try {
            quizzesArray = JSON.parse(quizzes);
            console.log('quizzes type after parsing:', typeof quizzesArray);
        } catch (error) {
            console.error("Error parsing quizzes:", error);
            throw new Error("Invalid quiz format");
        }
    } else {
        quizzesArray = quizzes;
    }

    try {
        const manyFlashcards = await prisma.quiz.createMany({
            data: quizzesArray['questions'].map((quiz: any) => ({
                question: quiz.question,
                correctAnswer: quiz.correct_answer,
                answers : quiz.options,
                noteId: noteId
            }))
        });
        console.log("Flashcards created successfully:", manyFlashcards);
        const note = await prisma.note.findUnique({
            where: {
                id: noteId
            },
            include: {
                flashcards: true
            }
        });
        console.log("Updated note with flashcards:", note);
        return JSON.stringify(note);
    } catch (error) {
        console.error("Error adding flashcards:", error);
        throw error;
    }
}
export async function addQuiz(noteId: string, quiz: any) {
    try {
        console.log("Creating quiz:", quiz);
        const newQuiz = await prisma.quiz.create({
            data: {
                ...quiz,
                noteId
            }
        });
        console.log("Quiz created successfully:", newQuiz);
        return JSON.stringify(newQuiz);
    } catch (error) {
        console.error("Error creating quiz:", error);
        throw error;
    }
}
export async function updateQuizById(id: string, quiz: any){
    console.log("Updating quiz:", quiz);
    try {
        
        const updatedQuiz= await prisma.quiz.update({
            where: {
                id: id
            },
            data: {
                ...quiz
            }
        });
        console.log("Quiz updated successfully:", updatedQuiz);
        return JSON.stringify(updatedQuiz);
        
    } catch (error) {
        
    }
}
export async function deleteQuizById(id: string){
    try {
        const quiz = await prisma.quiz.delete({
            where: {
                id: id
            }
        });
        console.log("Quiz deleted successfully:", quiz);
        return JSON.stringify(quiz);
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        throw error;
    }
}
export async function findUser(id: any){
    const user = await prisma.user.findUnique({
        where: { id }
       
    });
    return JSON.stringify(user);
}
export async function increaseLimit(userId: string){
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId} 
        });
        console.log("User found:", user);
        const updateUser = await prisma.user.update({
            where: {id: userId},
            data: {
                apiLimit: { increment: 1 }
            }
        });
        return updateUser;
    } catch (error) {
        JSON.stringify({error: "User not found"});
    }
}
export async function checkApiLimit(userId: string){
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId} 
        });
        if (!user || user.apiLimit< MAX_FREE_COUNTS){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        JSON.stringify({error: "User not found"});
    }
}export async function getApiLimit(userId: string){
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId} 
        });
        return user.apiLimit;
    } catch (error) {
        JSON.stringify({error: "User not found"});
    }
}