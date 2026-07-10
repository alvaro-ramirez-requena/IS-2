-- CreateEnum
CREATE TYPE "EvidencePhase" AS ENUM ('BEFORE', 'AFTER');

-- CreateTable
CREATE TABLE "FieldWork" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "arrivedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "arrivalLat" DOUBLE PRECISION,
    "arrivalLng" DOUBLE PRECISION,
    "distanceMeters" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldWorkEvidence" (
    "id" TEXT NOT NULL,
    "fieldWorkId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "phase" "EvidencePhase" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldWorkEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldWork_reportId_key" ON "FieldWork"("reportId");

-- CreateIndex
CREATE INDEX "FieldWork_reportId_idx" ON "FieldWork"("reportId");

-- CreateIndex
CREATE INDEX "FieldWork_technicianId_idx" ON "FieldWork"("technicianId");

-- CreateIndex
CREATE INDEX "FieldWorkEvidence_fieldWorkId_idx" ON "FieldWorkEvidence"("fieldWorkId");

-- AddForeignKey
ALTER TABLE "FieldWork" ADD CONSTRAINT "FieldWork_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldWork" ADD CONSTRAINT "FieldWork_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldWorkEvidence" ADD CONSTRAINT "FieldWorkEvidence_fieldWorkId_fkey" FOREIGN KEY ("fieldWorkId") REFERENCES "FieldWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
