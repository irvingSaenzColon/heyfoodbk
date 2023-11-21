-- DropForeignKey
ALTER TABLE `food` DROP FOREIGN KEY `Food_nutrimentId_fkey`;

-- AlterTable
ALTER TABLE `nutriments` ADD COLUMN `portion` DECIMAL(6, 2) NOT NULL DEFAULT 100;

-- AddForeignKey
ALTER TABLE `Food` ADD CONSTRAINT `Food_nutrimentId_fkey` FOREIGN KEY (`nutrimentId`) REFERENCES `Nutriments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
