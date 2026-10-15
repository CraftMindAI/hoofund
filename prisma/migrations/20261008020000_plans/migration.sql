-- CreateTable
CREATE TABLE `plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sort_order` INTEGER NOT NULL,
    `cows` INTEGER NOT NULL,
    `investment` INTEGER NOT NULL,
    `monthly_payment` INTEGER NOT NULL,
    `total_return` INTEGER NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `plans_sort_order_key`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Seed the five partner plans
INSERT INTO `plans` (`sort_order`, `cows`, `investment`, `monthly_payment`, `total_return`, `featured`, `updated_at`) VALUES
    (1, 1,  85000,  9000,  582400, false, CURRENT_TIMESTAMP(3)),
    (2, 2, 170000, 18000, 1164800, false, CURRENT_TIMESTAMP(3)),
    (3, 3, 250000, 25000, 1657200, false, CURRENT_TIMESTAMP(3)),
    (4, 4, 350000, 33000, 2094600, false, CURRENT_TIMESTAMP(3)),
    (5, 6, 500000, 42000, 2804400, true,  CURRENT_TIMESTAMP(3));
