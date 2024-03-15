/*
  Warnings:

  - Added the required column `gallery` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `gallery` VARCHAR(191) NOT NULL,
    MODIFY `text` MEDIUMTEXT NOT NULL,
    MODIFY `hashtags` MEDIUMTEXT NOT NULL;
