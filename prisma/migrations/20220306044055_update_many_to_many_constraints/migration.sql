-- DropForeignKey
ALTER TABLE `SceneInfluence` DROP FOREIGN KEY `SceneInfluence_influencedId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneInfluence` DROP FOREIGN KEY `SceneInfluence_influencerId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleInfluence` DROP FOREIGN KEY `StyleInfluence_influencedId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleInfluence` DROP FOREIGN KEY `StyleInfluence_influencerId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleParent` DROP FOREIGN KEY `StyleParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleParent` DROP FOREIGN KEY `StyleParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendStyleInfluence` DROP FOREIGN KEY `TrendStyleInfluence_influencedId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendStyleInfluence` DROP FOREIGN KEY `TrendStyleInfluence_influencerId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendStyleParent` DROP FOREIGN KEY `TrendStyleParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendStyleParent` DROP FOREIGN KEY `TrendStyleParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendTrendInfluence` DROP FOREIGN KEY `TrendTrendInfluence_influencedId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendTrendInfluence` DROP FOREIGN KEY `TrendTrendInfluence_influencerId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendTrendParent` DROP FOREIGN KEY `TrendTrendParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendTrendParent` DROP FOREIGN KEY `TrendTrendParent_parentId_fkey`;

-- AddForeignKey
ALTER TABLE `SceneInfluence` ADD CONSTRAINT `SceneInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Scene`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneInfluence` ADD CONSTRAINT `SceneInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Scene`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleParent` ADD CONSTRAINT `StyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleParent` ADD CONSTRAINT `StyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleInfluence` ADD CONSTRAINT `StyleInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleInfluence` ADD CONSTRAINT `StyleInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendParent` ADD CONSTRAINT `TrendTrendParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendParent` ADD CONSTRAINT `TrendTrendParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleParent` ADD CONSTRAINT `TrendStyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleParent` ADD CONSTRAINT `TrendStyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendInfluence` ADD CONSTRAINT `TrendTrendInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendInfluence` ADD CONSTRAINT `TrendTrendInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleInfluence` ADD CONSTRAINT `TrendStyleInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleInfluence` ADD CONSTRAINT `TrendStyleInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Trend`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
