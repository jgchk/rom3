-- AlterTable
ALTER TABLE `Scene` MODIFY `shortDesc` VARCHAR(255) NOT NULL,
    MODIFY `longDesc` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Style` MODIFY `shortDesc` VARCHAR(255) NOT NULL,
    MODIFY `longDesc` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Trend` MODIFY `shortDesc` VARCHAR(255) NOT NULL,
    MODIFY `longDesc` TEXT NOT NULL;
