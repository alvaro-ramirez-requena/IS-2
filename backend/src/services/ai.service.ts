import { prisma } from "../config/prisma";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function askGroq(prompt: string): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Eres un sistema de análisis de reportes urbanos. Responde SOLO en formato JSON válido, sin texto adicional, sin markdown, sin explicaciones.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "{}";
}

// ── 1. Clasificación automática ───────────────────────────────────────────────
export async function classifyReport(
  description: string,
  currentCategory: string,
  currentProblemType: string
) {
  const prompt = `
Analiza esta descripción de un reporte urbano y devuelve un JSON con la clasificación sugerida.

Descripción: "${description}"
Categoría actual: "${currentCategory}"
Tipo de problema actual: "${currentProblemType}"

Categorías disponibles: SECURITY, ENVIRONMENT, INFRASTRUCTURE, MOBILITY

Tipos por categoría:
- SECURITY: Robo o hurto, Presencia de pandillas, Violencia doméstica, Consumo de drogas en vía pública, Acoso callejero, Incidente de violencia, Persona en situación de calle
- ENVIRONMENT: Acumulación de basura, Quema de residuos, Contaminación de agua, Ruido excesivo, Presencia de plagas, Microbasural
- INFRASTRUCTURE: Pista en mal estado, Vereda dañada, Alumbrado público defectuoso, Semáforo dañado, Fuga de agua, Colapso de desagüe
- MOBILITY: Vehículo abandonado, Señalización vial deteriorada, Paradero informal, Venta ambulante no autorizada, Exceso de velocidad, Estacionamiento indebido

Responde SOLO con este JSON:
{
  "suggestedCategory": "CATEGORY",
  "suggestedProblemType": "tipo de problema",
  "confidence": "alta|media|baja",
  "matches": true,
  "reason": "breve explicación en español"
}
`;

  try {
    const raw = await askGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      suggestedCategory: currentCategory,
      suggestedProblemType: currentProblemType,
      confidence: "baja",
      matches: true,
      reason: "No se pudo analizar automáticamente.",
    };
  }
}

// ── 2. Priorización automática ────────────────────────────────────────────────
export async function prioritizeReport(
  description: string,
  category: string,
  problemType: string
) {
  const prompt = `
Analiza este reporte urbano y estima su nivel de prioridad.

Categoría: "${category}"
Tipo: "${problemType}"
Descripción: "${description}"

Criterios:
- ALTO: riesgo para la vida, peligro inmediato, afecta muchas personas
- MEDIO: problema significativo pero no urgente, afecta calidad de vida
- BAJO: inconveniencia menor, problema estético o de bajo impacto

Responde SOLO con este JSON:
{
  "priority": "ALTO|MEDIO|BAJO",
  "gravedad": "alta|media|baja",
  "riesgo": "alto|medio|bajo",
  "justification": "breve justificación en español (máximo 2 oraciones)"
}
`;

  try {
    const raw = await askGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      priority: "MEDIO",
      gravedad: "media",
      riesgo: "medio",
      justification: "No se pudo analizar automáticamente.",
    };
  }
}

// ── 3. Detección de duplicados ────────────────────────────────────────────────
export async function detectDuplicates(reportId: string) {
  // Obtiene el reporte actual
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      problemType: true,
      description: true,
      category: true,
      latitude: true,
      longitude: true,
      createdAt: true,
    },
  });

  if (!report) return { duplicates: [], hasDuplicates: false };

  // Busca reportes similares: mismo tipo de problema, últimos 30 días
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const candidates = await prisma.report.findMany({
    where: {
      id: { not: reportId },
      problemType: report.problemType,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      id: true,
      problemType: true,
      description: true,
      address: true,
      status: true,
      createdAt: true,
      latitude: true,
      longitude: true,
    },
    take: 10,
  });

  if (candidates.length === 0) {
    return { duplicates: [], hasDuplicates: false };
  }

  // Filtra por distancia GPS (menos de 200 metros)
  const nearbyReports = candidates.filter((c) => {
    if (!c.latitude || !c.longitude || !report.latitude || !report.longitude) {
      return false;
    }
    const R = 6371000;
    const dLat = ((c.latitude - report.latitude) * Math.PI) / 180;
    const dLng = ((c.longitude - report.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((report.latitude * Math.PI) / 180) *
        Math.cos((c.latitude * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return distance < 200;
  });

  if (nearbyReports.length === 0) {
    return { duplicates: [], hasDuplicates: false };
  }

  // Usa IA para confirmar si son duplicados reales
  const prompt = `
Analiza si estos reportes son duplicados del reporte principal.

Reporte principal:
- Tipo: "${report.problemType}"
- Descripción: "${report.description}"

Reportes candidatos:
${nearbyReports.map((r, i) => `${i + 1}. Tipo: "${r.problemType}" - Descripción: "${r.description}" - Estado: "${r.status}"`).join("\n")}

Responde SOLO con este JSON:
{
  "duplicateIndexes": [lista de números de los que SÍ son duplicados, vacía si ninguno],
  "confidence": "alta|media|baja"
}
`;

  try {
    const raw = await askGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    const confirmedDuplicates = (result.duplicateIndexes || []).map(
      (i: number) => nearbyReports[i - 1]
    ).filter(Boolean);

    return {
      duplicates: confirmedDuplicates,
      hasDuplicates: confirmedDuplicates.length > 0,
      confidence: result.confidence,
    };
  } catch {
    return {
      duplicates: nearbyReports,
      hasDuplicates: nearbyReports.length > 0,
      confidence: "baja",
    };
  }
}

// ── 4. Alerta por retrasos ────────────────────────────────────────────────────
export async function detectDelayedReports() {
  const now = new Date();

  // Umbrales de tiempo por estado (en días)
  const thresholds: Record<string, number> = {
    REGISTERED: 2,    // más de 2 días sin validar
    VALIDATING: 3,    // más de 3 días en validación
    APPROVED: 5,      // más de 5 días sin priorizar
    PRIORITIZED: 7,   // más de 7 días sin asignar
    ASSIGNED: 10,     // más de 10 días sin iniciar
    IN_PROGRESS: 14,  // más de 14 días en progreso
  };

  const delayed: any[] = [];

  for (const [status, days] of Object.entries(thresholds)) {
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const reports = await prisma.report.findMany({
      where: {
        status: status as any,
        updatedAt: { lte: cutoff },
      },
      select: {
        id: true,
        problemType: true,
        status: true,
        address: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "asc" },
      take: 5,
    });

    reports.forEach((r) => {
      const daysDelayed = Math.floor(
        (now.getTime() - new Date(r.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      delayed.push({
        ...r,
        daysDelayed,
        expectedDays: days,
        alertLevel: daysDelayed > days * 2 ? "CRITICO" : "ADVERTENCIA",
      });
    });
  }

  // Ordena por días de retraso (más crítico primero)
  delayed.sort((a, b) => b.daysDelayed - a.daysDelayed);

  return {
    total: delayed.length,
    alerts: delayed.slice(0, 10),
  };
}
