-- DropForeignKey
ALTER TABLE `GenreCreate` DROP FOREIGN KEY `GenreCreate_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `GenreDelete` DROP FOREIGN KEY `GenreDelete_correctionId_fkey`;

-- DropForeignKey
ALTER TABLE `GenreDelete` DROP FOREIGN KEY `GenreDelete_targetGenreId_fkey`;

-- DropForeignKey
ALTER TABLE `GenreEdit` DROP FOREIGN KEY `GenreEdit_correctionId_fkey`;

-- AddForeignKey
ALTER TABLE `GenreCreate` ADD CONSTRAINT `GenreCreate_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreEdit` ADD CONSTRAINT `GenreEdit_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreDelete` ADD CONSTRAINT `GenreDelete_targetGenreId_fkey` FOREIGN KEY (`targetGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GenreDelete` ADD CONSTRAINT `GenreDelete_correctionId_fkey` FOREIGN KEY (`correctionId`) REFERENCES `Correction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
