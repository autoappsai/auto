/*
  Warnings:

  - A unique constraint covering the columns `[shopifyApiKey]` on the table `Installations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Installations_shopifyApiKey_key` ON `Installations`(`shopifyApiKey`);
