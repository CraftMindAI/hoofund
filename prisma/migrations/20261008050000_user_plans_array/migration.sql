-- DropForeignKey
ALTER TABLE `user_plans` DROP FOREIGN KEY `user_plans_plan_id_fkey`;

-- DropIndex
DROP INDEX `user_plans_plan_id_idx` ON `user_plans`;

-- AlterTable
ALTER TABLE `user_plans` DROP COLUMN `plan_id`,
    DROP COLUMN `started_at`,
    ADD COLUMN `plan_ids` JSON NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_plans_user_id_key` ON `user_plans`(`user_id`);

