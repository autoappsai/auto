/*
  Warnings:

  - Added the required column `shopifyApiKey` to the `Installations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyApiSecret` to the `Installations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Installations` ADD COLUMN `shopifyApiKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `shopifyApiSecret` VARCHAR(191) NOT NULL;
