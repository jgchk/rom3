-- CreateTable
CREATE TABLE `MetaDeletion` (
    `correctionId` INTEGER NOT NULL,
    `targetMetaId` INTEGER NOT NULL,

    UNIQUE INDEX `MetaDeletion_correctionId_targetMetaId_key`(`correctionId`, `targetMetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SceneDeletion` (
    `correctionId` INTEGER NOT NULL,
    `targetSceneId` INTEGER NOT NULL,

    UNIQUE INDEX `SceneDeletion_correctionId_targetSceneId_key`(`correctionId`, `targetSceneId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleDeletion` (
    `correctionId` INTEGER NOT NULL,
    `targetStyleId` INTEGER NOT NULL,

    UNIQUE INDEX `StyleDeletion_correctionId_targetStyleId_key`(`correctionId`, `targetStyleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendDeletion` (
    `correctionId` INTEGER NOT NULL,
    `targetTrendId` INTEGER NOT NULL,

    UNIQUE INDEX `TrendDeletion_correctionId_targetTrendId_key`(`correctionId`, `targetTrendId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetaDeletion` ADD CONSTRAINT `MetaDeletion_targetMetaId_fkey` FOREIGN KEY (`targetMetaId`) REFERENCES `Meta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaDeletion` ADD CONSTRAINT `MetaDeletion_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneDeletion` ADD CONSTRAINT `SceneDeletion_targetSceneId_fkey` FOREIGN KEY (`targetSceneId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneDeletion` ADD CONSTRAINT `SceneDeletion_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleDeletion` ADD CONSTRAINT `StyleDeletion_targetStyleId_fkey` FOREIGN KEY (`targetStyleId`) REFERENCES `Style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleDeletion` ADD CONSTRAINT `StyleDeletion_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendDeletion` ADD CONSTRAINT `TrendDeletion_targetTrendId_fkey` FOREIGN KEY (`targetTrendId`) REFERENCES `Trend`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrendDeletion` ADD CONSTRAINT `TrendDeletion_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
