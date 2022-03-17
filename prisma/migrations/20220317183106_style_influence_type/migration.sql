/*
  Warnings:

  - Added the required column `influenceType` to the `StyleInfluence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `influenceType` to the `TrendStyleInfluence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StyleInfluence` ADD COLUMN `influenceType` ENUM('HISTORICAL', 'SONIC') NOT NULL;

-- AlterTable
ALTER TABLE `TrendStyleInfluence` ADD COLUMN `influenceType` ENUM('HISTORICAL', 'SONIC') NOT NULL;
