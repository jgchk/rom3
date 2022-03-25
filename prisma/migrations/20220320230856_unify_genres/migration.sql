/*
  Warnings:

  - You are about to drop the `Meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaCorrection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaDeletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scene` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneCorrection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneCulture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneDeletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneInfluence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SceneName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Style` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleCorrection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleCulture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleDeletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleInfluence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleMetaParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleStyleParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendCorrection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendCulture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendDeletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendMetaParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendStyleInfluence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendStyleParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendTrendInfluence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrendTrendParent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MetaCorrection` DROP FOREIGN KEY `MetaCorrection_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaCorrection` DROP FOREIGN KEY `MetaCorrection_metaId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaCorrection` DROP FOREIGN KEY `MetaCorrection_targetMetaId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaDeletion` DROP FOREIGN KEY `MetaDeletion_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaDeletion` DROP FOREIGN KEY `MetaDeletion_targetMetaId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaName` DROP FOREIGN KEY `MetaName_metaId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaParent` DROP FOREIGN KEY `MetaParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `MetaParent` DROP FOREIGN KEY `MetaParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneCorrection` DROP FOREIGN KEY `SceneCorrection_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneCorrection` DROP FOREIGN KEY `SceneCorrection_sceneId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneCorrection` DROP FOREIGN KEY `SceneCorrection_targetSceneId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneCulture` DROP FOREIGN KEY `SceneCulture_cultureId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneCulture` DROP FOREIGN KEY `SceneCulture_sceneId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneDeletion` DROP FOREIGN KEY `SceneDeletion_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneDeletion` DROP FOREIGN KEY `SceneDeletion_targetSceneId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneInfluence` DROP FOREIGN KEY `SceneInfluence_influencedId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneInfluence` DROP FOREIGN KEY `SceneInfluence_influencerId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneLocation` DROP FOREIGN KEY `SceneLocation_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneLocation` DROP FOREIGN KEY `SceneLocation_sceneId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneName` DROP FOREIGN KEY `SceneName_sceneId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleCorrection` DROP FOREIGN KEY `StyleCorrection_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleCorrection` DROP FOREIGN KEY `StyleCorrection_styleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleCorrection` DROP FOREIGN KEY `StyleCorrection_targetStyleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleCulture` DROP FOREIGN KEY `StyleCulture_cultureId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleCulture` DROP FOREIGN KEY `StyleCulture_styleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleDeletion` DROP FOREIGN KEY `StyleDeletion_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleDeletion` DROP FOREIGN KEY `StyleDeletion_targetStyleId_fkey`;

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
ALTER TABLE `StyleMetaParent` DROP FOREIGN KEY `StyleMetaParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleName` DROP FOREIGN KEY `StyleName_styleId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleStyleParent` DROP FOREIGN KEY `StyleStyleParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `StyleStyleParent` DROP FOREIGN KEY `StyleStyleParent_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCorrection` DROP FOREIGN KEY `TrendCorrection_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCorrection` DROP FOREIGN KEY `TrendCorrection_targetTrendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCorrection` DROP FOREIGN KEY `TrendCorrection_trendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCulture` DROP FOREIGN KEY `TrendCulture_cultureId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendCulture` DROP FOREIGN KEY `TrendCulture_trendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendDeletion` DROP FOREIGN KEY `TrendDeletion_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendDeletion` DROP FOREIGN KEY `TrendDeletion_targetTrendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendLocation` DROP FOREIGN KEY `TrendLocation_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendLocation` DROP FOREIGN KEY `TrendLocation_trendId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendMetaParent` DROP FOREIGN KEY `TrendMetaParent_childId_fkey`;

-- DropForeignKey
ALTER TABLE `TrendMetaParent` DROP FOREIGN KEY `TrendMetaParent_parentId_fkey`;

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

-- DropTable
DROP TABLE `Meta`;

-- DropTable
DROP TABLE `MetaCorrection`;

-- DropTable
DROP TABLE `MetaDeletion`;

-- DropTable
DROP TABLE `MetaName`;

-- DropTable
DROP TABLE `MetaParent`;

-- DropTable
DROP TABLE `Scene`;

-- DropTable
DROP TABLE `SceneCorrection`;

-- DropTable
DROP TABLE `SceneCulture`;

-- DropTable
DROP TABLE `SceneDeletion`;

-- DropTable
DROP TABLE `SceneInfluence`;

-- DropTable
DROP TABLE `SceneLocation`;

-- DropTable
DROP TABLE `SceneName`;

-- DropTable
DROP TABLE `Style`;

-- DropTable
DROP TABLE `StyleCorrection`;

-- DropTable
DROP TABLE `StyleCulture`;

-- DropTable
DROP TABLE `StyleDeletion`;

-- DropTable
DROP TABLE `StyleInfluence`;

-- DropTable
DROP TABLE `StyleLocation`;

-- DropTable
DROP TABLE `StyleMetaParent`;

-- DropTable
DROP TABLE `StyleName`;

-- DropTable
DROP TABLE `StyleStyleParent`;

-- DropTable
DROP TABLE `Trend`;

-- DropTable
DROP TABLE `TrendCorrection`;

-- DropTable
DROP TABLE `TrendCulture`;

-- DropTable
DROP TABLE `TrendDeletion`;

-- DropTable
DROP TABLE `TrendLocation`;

-- DropTable
DROP TABLE `TrendMetaParent`;

-- DropTable
DROP TABLE `TrendName`;

-- DropTable
DROP TABLE `TrendStyleInfluence`;

-- DropTable
DROP TABLE `TrendStyleParent`;

-- DropTable
DROP TABLE `TrendTrendInfluence`;

-- DropTable
DROP TABLE `TrendTrendParent`;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('META', 'SCENE', 'STYLE', 'TREND') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortDesc` VARCHAR(255) NOT NULL,
    `longDesc` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreName` (
    `genreId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`genreId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,
    `influenceType` ENUM('HISTORICAL', 'SONIC') NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreLocation` (
    `genreId` INTEGER NOT NULL,
    `locationId` INTEGER NOT NULL,

    PRIMARY KEY (`genreId`, `locationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreCulture` (
    `genreId` INTEGER NOT NULL,
    `cultureId` INTEGER NOT NULL,

    PRIMARY KEY (`genreId`, `cultureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreCreate` (
    `correctionId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    UNIQUE INDEX `GenreCreate_genreId_key`(`genreId`),
    PRIMARY KEY (`correctionId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreEdit` (
    `correctionId` INTEGER NOT NULL,
    `updatedGenreId` INTEGER NOT NULL,
    `targetGenreId` INTEGER NOT NULL,

    UNIQUE INDEX `GenreEdit_updatedGenreId_key`(`updatedGenreId`),
    PRIMARY KEY (`correctionId`, `targetGenreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreDelete` (
    `correctionId` INTEGER NOT NULL,
    `targetGenreId` INTEGER NOT NULL,

    PRIMARY KEY (`correctionId`, `targetGenreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GenreName` ADD CONSTRAINT `GenreName_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreParent` ADD CONSTRAINT `GenreParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreParent` ADD CONSTRAINT `GenreParent_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreInfluence` ADD CONSTRAINT `GenreInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreInfluence` ADD CONSTRAINT `GenreInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreLocation` ADD CONSTRAINT `GenreLocation_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreLocation` ADD CONSTRAINT `GenreLocation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreCulture` ADD CONSTRAINT `GenreCulture_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreCulture` ADD CONSTRAINT `GenreCulture_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `Culture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreCreate` ADD CONSTRAINT `GenreCreate_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreCreate` ADD CONSTRAINT `GenreCreate_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_updatedGenreId_fkey` FOREIGN KEY (`updatedGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_targetGenreId_fkey` FOREIGN KEY (`targetGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreDelete` ADD CONSTRAINT `GenreDelete_targetGenreId_fkey` FOREIGN KEY (`targetGenreId`) REFERENCES `Genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreDelete` ADD CONSTRAINT `GenreDelete_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
