/*
  Warnings:

  - The primary key for the `GenreCreate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `genreId` on the `GenreCreate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[createdGenreId]` on the table `GenreCreate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdGenreId` to the `GenreCreate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `GenreCreate` DROP FOREIGN KEY `GenreCreate_genreId_fkey`;

-- AlterTable
ALTER TABLE `GenreCreate` DROP PRIMARY KEY,
    DROP COLUMN `genreId`,
    ADD COLUMN `createdGenreId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`correctionId`, `createdGenreId`);

-- CreateIndex
CREATE UNIQUE INDEX `GenreCreate_createdGenreId_key` ON `GenreCreate`(`createdGenreId`);

-- AddForeignKey
ALTER TABLE `GenreCreate` ADD CONSTRAINT `GenreCreate_createdGenreId_fkey` FOREIGN KEY (`createdGenreId`) REFERENCES `Genre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
