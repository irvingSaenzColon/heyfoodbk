/*
  Warnings:

  - You are about to drop the column `type` on the `dailymeal` table. All the data in the column will be lost.
  - Added the required column `type` to the `DailyMealDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailymeal` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `dailymealdetail` ADD COLUMN `type` VARCHAR(191) NOT NULL;
