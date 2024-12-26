-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "Flashcard" TEXT[] DEFAULT ARRAY[]::TEXT[];
