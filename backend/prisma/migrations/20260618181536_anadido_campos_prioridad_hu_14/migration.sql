-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAJO', 'MEDIO', 'ALTO');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "impact" TEXT,
ADD COLUMN     "justification" TEXT,
ADD COLUMN     "operationalType" TEXT,
ADD COLUMN     "priority" "Priority",
ADD COLUMN     "probability" TEXT,
ADD COLUMN     "targetDate" TIMESTAMP(3);
