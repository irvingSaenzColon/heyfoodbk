-- DropForeignKey
ALTER TABLE `dailymealdetail` DROP FOREIGN KEY `DailyMealDetail_foodId_fkey`;

-- AlterTable
ALTER TABLE `dailymealdetail` ADD COLUMN `recipeId` INTEGER NULL,
    MODIFY `foodId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `DailyMealDetail` ADD CONSTRAINT `DailyMealDetail_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealDetail` ADD CONSTRAINT `DailyMealDetail_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
