-- CreateTable
CREATE TABLE `Scene` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortDesc` VARCHAR(191) NOT NULL,
    `longDesc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SceneName` (
    `sceneId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`sceneId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SceneInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Style` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortDesc` VARCHAR(191) NOT NULL,
    `longDesc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleName` (
    `styleId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`styleId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trend` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortDesc` VARCHAR(191) NOT NULL,
    `longDesc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendName` (
    `trendId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`trendId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendTrendParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendStyleParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendTrendInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendStyleInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SceneName` ADD CONSTRAINT `SceneName_sceneId_fkey` FOREIGN KEY (`sceneId`) REFERENCES `Scene`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneInfluence` ADD CONSTRAINT `SceneInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Scene`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SceneInfluence` ADD CONSTRAINT `SceneInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Scene`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `StyleName` ADD CONSTRAINT `StyleName_styleId_fkey` FOREIGN KEY (`styleId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleParent` ADD CONSTRAINT `StyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `StyleParent` ADD CONSTRAINT `StyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `StyleInfluence` ADD CONSTRAINT `StyleInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `StyleInfluence` ADD CONSTRAINT `StyleInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendName` ADD CONSTRAINT `TrendName_trendId_fkey` FOREIGN KEY (`trendId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendParent` ADD CONSTRAINT `TrendTrendParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendTrendParent` ADD CONSTRAINT `TrendTrendParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendStyleParent` ADD CONSTRAINT `TrendStyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendStyleParent` ADD CONSTRAINT `TrendStyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendTrendInfluence` ADD CONSTRAINT `TrendTrendInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendTrendInfluence` ADD CONSTRAINT `TrendTrendInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendStyleInfluence` ADD CONSTRAINT `TrendStyleInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TrendStyleInfluence` ADD CONSTRAINT `TrendStyleInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;
