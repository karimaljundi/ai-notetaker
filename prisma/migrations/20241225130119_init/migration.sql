-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;