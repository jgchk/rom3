-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('META', 'SCENE', 'STYLE', 'TREND') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortDesc` VARCHAR(255) NULL,
    `longDesc` TEXT NULL,
    `trial` BOOLEAN NOT NULL DEFAULT false,

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
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Location_city_region_country_key`(`city`, `region`, `country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Culture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Culture_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Correction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `creatorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreCreate` (
    `correctionId` INTEGER NOT NULL,
    `createdGenreId` INTEGER NOT NULL,

    UNIQUE INDEX `GenreCreate_createdGenreId_key`(`createdGenreId`),
    PRIMARY KEY (`correctionId`, `createdGenreId`)
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

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_username_key`(`username`),
    PRIMARY KEY (`id`)
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
ALTER TABLE `Correction` ADD CONSTRAINT `Correction_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreCreate` ADD CONSTRAINT `GenreCreate_createdGenreId_fkey` FOREIGN KEY (`createdGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreCreate` ADD CONSTRAINT `GenreCreate_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_updatedGenreId_fkey` FOREIGN KEY (`updatedGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_targetGenreId_fkey` FOREIGN KEY (`targetGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreDelete` ADD CONSTRAINT `GenreDelete_targetGenreId_fkey` FOREIGN KEY (`targetGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreDelete` ADD CONSTRAINT `GenreDelete_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
