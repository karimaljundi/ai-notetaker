/*
  Warnings:

  - You are about to drop the `UserApiLimit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserApiLimit" DROP CONSTRAINT "UserApiLimit_userId_fkey";

-- DropTable
DROP TABLE "UserApiLimit";

-- CreateTable
CREATE TABLE "Userapilimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "limit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Userapilimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Userapilimit_userId_key" ON "Userapilimit"("userId");

-- AddForeignKey
ALTER TABLE "Userapilimit" ADD CONSTRAINT "Userapilimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
