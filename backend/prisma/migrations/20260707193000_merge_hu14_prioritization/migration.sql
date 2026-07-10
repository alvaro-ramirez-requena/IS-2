-- HU14 - Campos de priorización de reportes
CREATE TYPE "Priority" AS ENUM ('BAJO', 'MEDIO', 'ALTO');

ALTER TABLE "Report"
  ADD COLUMN "priority" "Priority",
  ADD COLUMN "impact" TEXT,
  ADD COLUMN "probability" TEXT,
  ADD COLUMN "operationalType" TEXT,
  ADD COLUMN "targetDate" TIMESTAMP(3),
  ADD COLUMN "justification" TEXT;
