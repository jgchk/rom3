-- DropForeignKey
ALTER TABLE `MetaName` DROP FOREIGN KEY `MetaName_metaId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaParent` DROP FOREIGN KEY `MetaParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaParent` DROP FOREIGN KEY `MetaParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleMetaParent` DROP FOREIGN KEY `StyleMetaParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendMetaParent` DROP FOREIGN KEY `TrendMetaParent_parentId_fkey`;

-- AddForeignKey
ALTER TABLE `MetaName` ADD CONSTRAINT `MetaName_metaId_fkey` FOREIGN KEY (`metaId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaParent` ADD CONSTRAINT `MetaParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaParent` ADD CONSTRAINT `MetaParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleMetaParent` ADD CONSTRAINT `StyleMetaParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendMetaParent` ADD CONSTRAINT `TrendMetaParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
