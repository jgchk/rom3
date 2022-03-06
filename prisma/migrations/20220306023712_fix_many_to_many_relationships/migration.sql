/*
  Warnings:

  - You are about to drop the `_SceneInfluences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StyleInfluences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StyleParents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TrendStyleInfluences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TrendStyleParents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TrendTrendInfluences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TrendTrendParents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_SceneInfluences`;

-- DropTable
DROP TABLE `_StyleInfluences`;

-- DropTable
DROP TABLE `_StyleParents`;

-- DropTable
DROP TABLE `_TrendStyleInfluences`;

-- DropTable
DROP TABLE `_TrendStyleParents`;

-- DropTable
DROP TABLE `_TrendTrendInfluences`;

-- DropTable
DROP TABLE `_TrendTrendParents`;

-- CreateTable
CREATE TABLE `SceneInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendTrendParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendStyleParent` (
    `parentId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendTrendInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrendStyleInfluence` (
    `influencerId` INTEGER NOT NULL,
    `influencedId` INTEGER NOT NULL,

    PRIMARY KEY (`influencerId`, `influencedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
