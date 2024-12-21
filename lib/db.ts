import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export async function addNote(title: string, content: string, email: string) {
//     console.log("Adding note to database");
//     try {
//         const note = await prisma.note.create({
//             data: {
//                 title,
//                 content,
//                 email,
                
//             },
//         });
//         return note;
//     } catch (error) {
//     }
// }