-- DropForeignKey
ALTER TABLE `StyleCulture` DROP FOREIGN KEY `StyleCulture_cultureId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleCulture` DROP FOREIGN KEY `StyleCulture_styleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleInfluence` DROP FOREIGN KEY `StyleInfluence_influencedId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleInfluence` DROP FOREIGN KEY `StyleInfluence_influencerId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleLocation` DROP FOREIGN KEY `StyleLocation_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleLocation` DROP FOREIGN KEY `StyleLocation_styleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleMetaParent` DROP FOREIGN KEY `StyleMetaParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleName` DROP FOREIGN KEY `StyleName_styleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleStyleParent` DROP FOREIGN KEY `StyleStyleParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleStyleParent` DROP FOREIGN KEY `StyleStyleParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCulture` DROP FOREIGN KEY `TrendCulture_cultureId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCulture` DROP FOREIGN KEY `TrendCulture_trendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendLocation` DROP FOREIGN KEY `TrendLocation_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendLocation` DROP FOREIGN KEY `TrendLocation_trendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendMetaParent` DROP FOREIGN KEY `TrendMetaParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendName` DROP FOREIGN KEY `TrendName_trendId_fkey`;

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
ALTER TABLE `StyleName` ADD CONSTRAINT `StyleName_styleId_fkey` FOREIGN KEY (`styleId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleStyleParent` ADD CONSTRAINT `StyleStyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleStyleParent` ADD CONSTRAINT `StyleStyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleMetaParent` ADD CONSTRAINT `StyleMetaParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleInfluence` ADD CONSTRAINT `StyleInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleInfluence` ADD CONSTRAINT `StyleInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleLocation` ADD CONSTRAINT `StyleLocation_styleId_fkey` FOREIGN KEY (`styleId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleLocation` ADD CONSTRAINT `StyleLocation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleCulture` ADD CONSTRAINT `StyleCulture_styleId_fkey` FOREIGN KEY (`styleId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleCulture` ADD CONSTRAINT `StyleCulture_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `Culture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendName` ADD CONSTRAINT `TrendName_trendId_fkey` FOREIGN KEY (`trendId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendParent` ADD CONSTRAINT `TrendTrendParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendParent` ADD CONSTRAINT `TrendTrendParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleParent` ADD CONSTRAINT `TrendStyleParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleParent` ADD CONSTRAINT `TrendStyleParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendMetaParent` ADD CONSTRAINT `TrendMetaParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendInfluence` ADD CONSTRAINT `TrendTrendInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendTrendInfluence` ADD CONSTRAINT `TrendTrendInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleInfluence` ADD CONSTRAINT `TrendStyleInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendStyleInfluence` ADD CONSTRAINT `TrendStyleInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendLocation` ADD CONSTRAINT `TrendLocation_trendId_fkey` FOREIGN KEY (`trendId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendLocation` ADD CONSTRAINT `TrendLocation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendCulture` ADD CONSTRAINT `TrendCulture_trendId_fkey` FOREIGN KEY (`trendId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendCulture` ADD CONSTRAINT `TrendCulture_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `Culture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
