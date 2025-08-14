/*
  Warnings:

  - You are about to drop the column `customer_name` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Complaint` table. All the data in the column will be lost.
  - Added the required column `priorityId` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Complaint" DROP COLUMN "customer_name",
DROP COLUMN "priority",
DROP COLUMN "status",
ADD COLUMN     "priorityId" TEXT NOT NULL,
ADD COLUMN     "statusId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Priority" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Priority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "public"."Status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Priority_name_key" ON "public"."Priority"("name");

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "public"."Priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
