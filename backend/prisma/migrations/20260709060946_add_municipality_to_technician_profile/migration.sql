/*
  Warnings:

  - You are about to drop the column `district` on the `TechnicianApplication` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `TechnicianProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TechnicianApplication" DROP COLUMN "district",
ADD COLUMN     "municipalityId" TEXT;

-- AlterTable
ALTER TABLE "TechnicianProfile" DROP COLUMN "district",
ADD COLUMN     "municipalityId" TEXT;

-- AddForeignKey
ALTER TABLE "TechnicianApplication" ADD CONSTRAINT "TechnicianApplication_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianProfile" ADD CONSTRAINT "TechnicianProfile_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
