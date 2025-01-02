/*
  Warnings:

  - You are about to drop the `Userapilimit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Userapilimit" DROP CONSTRAINT "Userapilimit_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiLimit" INTEGER NOT NULL DEFAULT 5;

-- DropTable
DROP TABLE "Userapilimit";
