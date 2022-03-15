/*
  Warnings:

  - You are about to drop the `StyleParent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `StyleParent` DROP FOREIGN KEY `StyleParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleParent` DROP FOREIGN KEY `StyleParent_parentId_fkey`;

-- DropTable
DROP TABLE `StyleParent`;

-- CreateTable
CREATE TABLE `Meta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortDesc` VARCHAR(255) NOT NULL,
    `longDesc` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetaName` (
    `metaId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`metaId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetaParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleStyleParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleMetaParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendMetaParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetaName` ADD CONSTRAINT `MetaName_metaId_fkey` FOREIGN KEY (`metaId`) REFERENCES `Meta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaParent` ADD CONSTRAINT `MetaParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Meta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaParent` ADD CONSTRAINT `MetaParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Meta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleStyleParent` ADD CONSTRAINT `StyleStyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleStyleParent` ADD CONSTRAINT `StyleStyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleMetaParent` ADD CONSTRAINT `StyleMetaParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Meta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleMetaParent` ADD CONSTRAINT `StyleMetaParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendMetaParent` ADD CONSTRAINT `TrendMetaParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Meta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendMetaParent` ADD CONSTRAINT `TrendMetaParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
