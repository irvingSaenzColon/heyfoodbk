/*
  Warnings:

  - You are about to drop the column `image` on the `weightmedia` table. All the data in the column will be lost.
  - Added the required column `url` to the `WeightMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `weightmedia` DROP COLUMN `image`,
    ADD COLUMN `url` VARCHAR(255) NOT NULL;
