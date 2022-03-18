/*
  Warnings:

  - You are about to drop the column `correctionId` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `correctionId` on the `Scene` table. All the data in the column will be lost.
  - You are about to drop the column `correctionId` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `correctionId` on the `Trend` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Meta` DROP FOREIGN KEY `Meta_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `Scene` DROP FOREIGN KEY `Scene_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `Style` DROP FOREIGN KEY `Style_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `Trend` DROP FOREIGN KEY `Trend_correctionId_fkey`;

-- AlterTable
ALTER TABLE `Meta` DROP COLUMN `correctionId`;

-- AlterTable
ALTER TABLE `Scene` DROP COLUMN `correctionId`;

-- AlterTable
ALTER TABLE `Style` DROP COLUMN `correctionId`;

-- AlterTable
ALTER TABLE `Trend` DROP COLUMN `correctionId`;

-- CreateTable
CREATE TABLE `MetaCorrection` (
    `correctionId` INTEGER NOT NULL,
    `metaId` INTEGER NOT NULL,
    `targetMetaId` INTEGER NULL,

    UNIQUE INDEX `MetaCorrection_correctionId_metaId_key`(`correctionId`, `metaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SceneCorrection` (
    `correctionId` INTEGER NOT NULL,
    `sceneId` INTEGER NOT NULL,
    `targetSceneId` INTEGER NULL,

    UNIQUE INDEX `SceneCorrection_correctionId_sceneId_key`(`correctionId`, `sceneId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleCorrection` (
    `correctionId` INTEGER NOT NULL,
    `styleId` INTEGER NOT NULL,
    `targetStyleId` INTEGER NULL,

    UNIQUE INDEX `StyleCorrection_correctionId_styleId_key`(`correctionId`, `styleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendCorrection` (
    `correctionId` INTEGER NOT NULL,
    `trendId` INTEGER NOT NULL,
    `targetTrendId` INTEGER NULL,

    UNIQUE INDEX `TrendCorrection_correctionId_trendId_key`(`correctionId`, `trendId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetaCorrection` ADD CONSTRAINT `MetaCorrection_metaId_fkey` FOREIGN KEY (`metaId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaCorrection` ADD CONSTRAINT `MetaCorrection_targetMetaId_fkey` FOREIGN KEY (`targetMetaId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaCorrection` ADD CONSTRAINT `MetaCorrection_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneCorrection` ADD CONSTRAINT `SceneCorrection_sceneId_fkey` FOREIGN KEY (`sceneId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneCorrection` ADD CONSTRAINT `SceneCorrection_targetSceneId_fkey` FOREIGN KEY (`targetSceneId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneCorrection` ADD CONSTRAINT `SceneCorrection_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleCorrection` ADD CONSTRAINT `StyleCorrection_styleId_fkey` FOREIGN KEY (`styleId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleCorrection` ADD CONSTRAINT `StyleCorrection_targetStyleId_fkey` FOREIGN KEY (`targetStyleId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleCorrection` ADD CONSTRAINT `StyleCorrection_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendCorrection` ADD CONSTRAINT `TrendCorrection_trendId_fkey` FOREIGN KEY (`trendId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendCorrection` ADD CONSTRAINT `TrendCorrection_targetTrendId_fkey` FOREIGN KEY (`targetTrendId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendCorrection` ADD CONSTRAINT `TrendCorrection_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
