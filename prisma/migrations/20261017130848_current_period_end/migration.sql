/*
  Warnings:

  - You are about to drop the column `currrentPeriodEnd` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `currentPeriodEnd` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "currrentPeriodEnd",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL;
