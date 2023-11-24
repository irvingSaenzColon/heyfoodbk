-- CreateTable
CREATE TABLE `RecipeCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriesOnRecipe` (
    `recipeId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`recipeId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CategoriesOnRecipe` ADD CONSTRAINT `CategoriesOnRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriesOnRecipe` ADD CONSTRAINT `CategoriesOnRecipe_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `RecipeCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
