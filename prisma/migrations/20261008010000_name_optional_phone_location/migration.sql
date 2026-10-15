-- AlterTable
ALTER TABLE `users` ADD COLUMN `name` VARCHAR(100) NOT NULL,
    MODIFY `phone` VARCHAR(20) NULL,
    MODIFY `location` VARCHAR(160) NULL;

