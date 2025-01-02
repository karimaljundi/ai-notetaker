// import prisma from "@/lib/prismadb";
// import { MAX_FREE_COUNTS } from "@/constants";

// export const increaseApiLimit = async (userId: string) => {
//     if (!userId) throw new Error("User ID is required");
    
//     try {
//         const apiLimit = await prisma.userapilimit.upsert({
//             where: { userId },
//             update: { limit: { increment: 1 } },
//             create: { userId, limit: 1 }
//         });
//         return apiLimit;
//     } catch (error) {
//         console.error("Error increasing API limit:", error);
//         throw error;
//     }
// };

// export const checkApiLimit = async (userId: string) => {
//     if (!userId) return false;
    
//     try {
//         const apiLimit = await prisma.userapilimit.findUnique({
//             where: { userId }
//         });
        
//         if (!apiLimit) return true;
//         return apiLimit.limit < MAX_FREE_COUNTS;
//     } catch (error) {
//         console.error("Error checking API limit:", error);
//         throw error;
//     }
// };