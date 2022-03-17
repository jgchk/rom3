-- DropForeignKey
ALTER TABLE `SceneCulture` DROP FOREIGN KEY `SceneCulture_cultureId_fkey`;

-- DropForeignKey
ALTER TABLE `SceneCulture` DROP FOREIGN KEY `SceneCulture_sceneId_fkey`;

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

-- AddForeignKey
ALTER TABLE `SceneName` ADD CONSTRAINT `SceneName_sceneId_fkey` FOREIGN KEY (`sceneId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneInfluence` ADD CONSTRAINT `SceneInfluence_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneInfluence` ADD CONSTRAINT `SceneInfluence_influencedId_fkey` FOREIGN KEY (`influencedId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneLocation` ADD CONSTRAINT `SceneLocation_sceneId_fkey` FOREIGN KEY (`sceneId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneLocation` ADD CONSTRAINT `SceneLocation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneCulture` ADD CONSTRAINT `SceneCulture_sceneId_fkey` FOREIGN KEY (`sceneId`) REFERENCES `Scene`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SceneCulture` ADD CONSTRAINT `SceneCulture_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `Culture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
