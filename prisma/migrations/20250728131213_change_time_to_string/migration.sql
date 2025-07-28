/*
  Warnings:

  - Made the column `time` on table `Log` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "time" SET NOT NULL;
