-- Switch users.id from random text ids (cuid/uuid) to 1, 2, 3, …
-- Existing users are numbered in the order they joined.

ALTER TABLE `users` ADD COLUMN `new_id` INTEGER NULL;

SET @n := 0;
UPDATE `users` SET `new_id` = (@n := @n + 1) ORDER BY `created_at`, `email`;

ALTER TABLE `users`
    DROP PRIMARY KEY,
    DROP COLUMN `id`,
    CHANGE COLUMN `new_id` `id` INTEGER NOT NULL AUTO_INCREMENT FIRST,
    ADD PRIMARY KEY (`id`);
