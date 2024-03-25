/*
  Warnings:

  - You are about to drop the column `shopifyClientId` on the `Installations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shop]` on the table `Installations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Installations_shopifyClientId_key` ON `Installations`;

-- AlterTable
ALTER TABLE `Installations` DROP COLUMN `shopifyClientId`,
    ADD COLUMN `accessToken` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `shop` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Installations_shop_key` ON `Installations`(`shop`);
