/*
  Warnings:

  - Added the required column `totalCalories` to the `DailyMeal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailymeal` ADD COLUMN `totalCalories` DECIMAL(6, 2) NOT NULL;
