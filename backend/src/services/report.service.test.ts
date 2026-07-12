import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { ReportService } from "./report.service";
import { Priority } from "@prisma/client";
import { prisma } from "../config/prisma";

describe("Priorización de Reportes", () => {
  let reportService: ReportService;

  beforeEach(() => {
    reportService = new ReportService();
    jest.spyOn(reportService['reportRepository'], 'findById')
        .mockResolvedValue({ id: "1", status: "APPROVED" } as any);
    jest.spyOn(reportService['reportRepository'], 'updatePrioritization')
        .mockImplementation(async (id: string, data: any) => data as any);
    jest.spyOn(prisma.slaConfiguration, 'findUnique')
        .mockResolvedValue({ id: "sla-1", priority: "ALTO", days: 3 } as any);
    jest.spyOn(prisma.reportFollow, 'findMany')
        .mockResolvedValue([] as any);
    jest.spyOn(prisma.notification, 'createMany')
        .mockResolvedValue({ count: 0 } as any);
  });

  test("Test 1: Prioridad Alto - Impacto Alto, Probabilidad Alto", async () => {
    const resultado = await reportService.prioritizeReport("1", {
      impact: "ALTO", 
      probability: "ALTO", 
      operationalType: "Bacheo", 
      targetDate: "2026-12-31", 
      justification: "Prueba 1"
    });
    expect(resultado.priority).toBe(Priority.ALTO);
  });

  test("Test 2: Prioridad Media - Impacto Alto, Probabilidad Baja", async () => {
    const resultado = await reportService.prioritizeReport("2", {
      impact: "ALTO", 
      probability: "BAJO", 
      operationalType: "Bacheo", 
      targetDate: "2026-12-31", 
      justification: "Prueba 2"
    });
    expect(resultado.priority).toBe(Priority.MEDIO);
  });

  test("Test 3: Prioridad Media - Impacto Medio, Probabilidad Medio", async () => {
    const resultado = await reportService.prioritizeReport("3", {
      impact: "MEDIO", 
      probability: "MEDIO", 
      operationalType: "Bacheo", 
      targetDate: "2026-12-31", 
      justification: "Prueba 3"
    });
    expect(resultado.priority).toBe(Priority.MEDIO);
  });

  test("Test 4: Prioridad Baja - Impacto Bajo, Probabilidad Bajo", async () => {
    const resultado = await reportService.prioritizeReport("4", {
      impact: "BAJO", 
      probability: "BAJO", 
      operationalType: "Bacheo", 
      targetDate: "2026-12-31", 
      justification: "Prueba 4"
    });
    expect(resultado.priority).toBe(Priority.BAJO);
  });
});