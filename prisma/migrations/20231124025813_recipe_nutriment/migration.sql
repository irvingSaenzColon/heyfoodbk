/*
  Warnings:

  - A unique constraint covering the columns `[nutrimentId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nutrimentId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recipe` ADD COLUMN `nutrimentId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Recipe_nutrimentId_key` ON `Recipe`(`nutrimentId`);

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_nutrimentId_fkey` FOREIGN KEY (`nutrimentId`) REFERENCES `Nutriments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
