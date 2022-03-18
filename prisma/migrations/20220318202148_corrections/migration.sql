-- AlterTable
ALTER TABLE `Meta` ADD COLUMN `correctionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Scene` ADD COLUMN `correctionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Style` ADD COLUMN `correctionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Trend` ADD COLUMN `correctionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Correction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Meta` ADD CONSTRAINT `Meta_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scene` ADD CONSTRAINT `Scene_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Style` ADD CONSTRAINT `Style_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trend` ADD CONSTRAINT `Trend_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
