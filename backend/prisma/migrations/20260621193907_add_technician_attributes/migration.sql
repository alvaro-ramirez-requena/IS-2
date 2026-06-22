-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "crew" TEXT,
ADD COLUMN     "specialty" TEXT,
ADD COLUMN     "zone" TEXT;
