-- CreateTable
CREATE TABLE "TechnicalAttention" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "fieldValues" JSONB NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "technicalResult" TEXT NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnicalAttention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TechnicalAttention_reportId_idx" ON "TechnicalAttention"("reportId");

-- CreateIndex
CREATE INDEX "TechnicalAttention_technicianId_idx" ON "TechnicalAttention"("technicianId");

-- AddForeignKey
ALTER TABLE "TechnicalAttention" ADD CONSTRAINT "TechnicalAttention_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalAttention" ADD CONSTRAINT "TechnicalAttention_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
