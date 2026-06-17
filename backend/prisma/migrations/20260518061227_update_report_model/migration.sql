/*
  Warnings:

  - Added the required column `category` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('SECURITY', 'ENVIRONMENT', 'INFRASTRUCTURE', 'MOBILITY');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "category" "ReportCategory" NOT NULL,
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
