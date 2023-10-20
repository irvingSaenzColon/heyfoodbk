-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `height` VARCHAR(6) NOT NULL DEFAULT '',
    `weight` VARCHAR(6) NOT NULL DEFAULT '',
    `telephone` VARCHAR(50) NOT NULL DEFAULT '',
    `gender` VARCHAR(10) NOT NULL,
    `image` VARCHAR(255) NOT NULL DEFAULT '',
    `cover` VARCHAR(255) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_nickname_key`(`nickname`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nutriments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `energy` DECIMAL(6, 2) NOT NULL,
    `calories` DECIMAL(6, 2) NOT NULL,
    `carbohydrates` DECIMAL(6, 2) NOT NULL,
    `proteins` DECIMAL(6, 2) NOT NULL,
    `fiber` DECIMAL(6, 2) NOT NULL,
    `potassium` DECIMAL(6, 2) NOT NULL,
    `sugar` DECIMAL(6, 2) NOT NULL,
    `fat` DECIMAL(6, 2) NOT NULL,
    `saturatedFats` DECIMAL(6, 2) NOT NULL,
    `polyunsaturatedFat` DECIMAL(6, 2) NOT NULL,
    `cholesterol` DECIMAL(6, 2) NOT NULL,
    `sodium` DECIMAL(6, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Food` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(75) NOT NULL,
    `nutrimentId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `Food_nutrimentId_key`(`nutrimentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodMedia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `fooId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `preparationTime` VARCHAR(6) NOT NULL,
    `cookingTime` VARCHAR(6) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeMedia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `recipeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeStep` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NOT NULL,
    `recipeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeIngredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `portion` DECIMAL(6, 2) NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `foodId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyMeal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyMealDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `portion` DECIMAL(6, 2) NOT NULL,
    `dailyMealId` INTEGER NOT NULL,
    `foodId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostMedia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentMedia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `commentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeightHeader` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `WeightHeader_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeightItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DECIMAL(6, 2) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `weightHeaderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeightMedia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `weightItemId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Food` ADD CONSTRAINT `Food_nutrimentId_fkey` FOREIGN KEY (`nutrimentId`) REFERENCES `Nutriments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Food` ADD CONSTRAINT `Food_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodMedia` ADD CONSTRAINT `FoodMedia_fooId_fkey` FOREIGN KEY (`fooId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeMedia` ADD CONSTRAINT `RecipeMedia_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeStep` ADD CONSTRAINT `RecipeStep_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeIngredient` ADD CONSTRAINT `RecipeIngredient_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeIngredient` ADD CONSTRAINT `RecipeIngredient_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMeal` ADD CONSTRAINT `DailyMeal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealDetail` ADD CONSTRAINT `DailyMealDetail_dailyMealId_fkey` FOREIGN KEY (`dailyMealId`) REFERENCES `DailyMeal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealDetail` ADD CONSTRAINT `DailyMealDetail_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostMedia` ADD CONSTRAINT `PostMedia_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentMedia` ADD CONSTRAINT `CommentMedia_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeightHeader` ADD CONSTRAINT `WeightHeader_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeightItem` ADD CONSTRAINT `WeightItem_weightHeaderId_fkey` FOREIGN KEY (`weightHeaderId`) REFERENCES `WeightHeader`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeightMedia` ADD CONSTRAINT `WeightMedia_weightItemId_fkey` FOREIGN KEY (`weightItemId`) REFERENCES `WeightItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
