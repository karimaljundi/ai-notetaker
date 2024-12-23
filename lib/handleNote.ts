
import prisma from './prismadb';


export async function addNote(title: string, content: string, email: string) {

        console.log("In db file", title, email);
        const findNote = await prisma.note.findMany({
            where: {
                email, title, content
            }
        })
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
    const notes = await prisma.note.findMany({
        where: {
            email: email
        }
    });
    return (notes);
}