-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Installations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopifyClientId` VARCHAR(191) NOT NULL,
    `shopifyAppUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Installations_shopifyClientId_key`(`shopifyClientId`),
    UNIQUE INDEX `Installations_shopifyAppUrl_key`(`shopifyAppUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialNetworks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SocialNetworks_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Installations_SocialNetworks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `installations_id` INTEGER NOT NULL,
    `socialNetworks_id` INTEGER NOT NULL,
    `token` MEDIUMTEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Installations_SocialNetworks_installations_id_socialNetworks_key`(`installations_id`, `socialNetworks_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `installations_SocialNetworks_id` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `hashtags` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeOfDay` VARCHAR(191) NOT NULL,
    `sent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Installations_SocialNetworks` ADD CONSTRAINT `Installations_SocialNetworks_installations_id_fkey` FOREIGN KEY (`installations_id`) REFERENCES `Installations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installations_SocialNetworks` ADD CONSTRAINT `Installations_SocialNetworks_socialNetworks_id_fkey` FOREIGN KEY (`socialNetworks_id`) REFERENCES `SocialNetworks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_installations_SocialNetworks_id_fkey` FOREIGN KEY (`installations_SocialNetworks_id`) REFERENCES `Installations_SocialNetworks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
