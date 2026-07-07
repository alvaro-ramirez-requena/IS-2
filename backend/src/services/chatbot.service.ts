import { prisma } from "../config/prisma";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function getSystemContext(role: string, page: string, pageId?: string): Promise<string> {

  const totalReports = await prisma.report.count();
  const byStatus = await prisma.report.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const byCategory = await prisma.report.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  const statusSummary = byStatus
    .map((s) => `${s.status}: ${s._count.status}`)
    .join(", ");

  const categorySummary = byCategory
    .map((c) => `${c.category}: ${c._count.category}`)
    .join(", ");

  let pageContext = "";

  if (page === "my-reports" && pageId) {
    const userReports = await prisma.report.findMany({
      where: { userId: pageId },
      select: { problemType: true, status: true, createdAt: true, address: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    pageContext = `
El usuario actualmente está en la página "Mis Reportes". Sus reportes son:
${userReports.map((r) => `- ${r.problemType} (${r.status}) - ${r.address || "sin dirección"} - ${new Date(r.createdAt).toLocaleDateString("es-PE")}`).join("\n")}
`;
  }

  if (page === "operator") {
    const pending = await prisma.report.findMany({
      where: { status: "REGISTERED" },
      select: { problemType: true, createdAt: true, address: true, category: true },
      orderBy: { createdAt: "asc" },
      take: 10,
    });
    const oldest = pending[0];
    pageContext = `
El operador está en su panel de control. Reportes pendientes de validación: ${pending.length}
${oldest ? `El más antiguo es: "${oldest.problemType}" registrado el ${new Date(oldest.createdAt).toLocaleDateString("es-PE")} en ${oldest.address || "sin dirección"}` : ""}
Lista de pendientes:
${pending.map((r) => `- ${r.problemType} (${r.category}) - ${r.address || "sin dirección"}`).join("\n")}
`;
  }

  if (page === "operator-detail" && pageId) {
    const report = await prisma.report.findUnique({
      where: { id: pageId },
      include: { user: { select: { firstName: true, lastName: true } }, evidences: true },
    });
    if (report) {
      pageContext = `
El operador está revisando el reporte:
- Tipo: ${report.problemType}
- Categoría: ${report.category}
- Descripción: ${report.description}
- Estado actual: ${report.status}
- Ubicación: ${report.address || "sin dirección"}
- Registrado por: ${report.isAnonymous ? "Anónimo" : `${report.user?.firstName} ${report.user?.lastName}`}
- Fecha: ${new Date(report.createdAt).toLocaleDateString("es-PE")}
- Evidencias: ${report.evidences.length} fotos
`;
    }
  }

  if (page === "fieldwork" && pageId) {
    const report = await prisma.report.findUnique({
      where: { id: pageId },
      include: { fieldWork: { include: { evidences: true } } },
    });
    if (report) {
      const fw = report.fieldWork;
      pageContext = `
El técnico está trabajando en el reporte:
- Tipo de problema: ${report.problemType}
- Categoría: ${report.category}
- Descripción: ${report.description}
- Ubicación: ${report.address || "sin dirección"}
- Estado: ${report.status}
${fw ? `
Trabajo de campo:
- Llegada: ${fw.arrivedAt ? new Date(fw.arrivedAt).toLocaleTimeString("es-PE") : "No registrada"}
- Cierre: ${fw.closedAt ? new Date(fw.closedAt).toLocaleTimeString("es-PE") : "No registrado"}
- Notas: ${fw.notes || "Sin notas"}
- Fotos antes: ${fw.evidences.filter((e) => e.phase === "BEFORE").length}
- Fotos después: ${fw.evidences.filter((e) => e.phase === "AFTER").length}
` : "No se ha iniciado el trabajo de campo aún."}
`;
    }
  }

  if (page === "create-report") {
  pageContext = `
El usuario está en la página "Crear nuevo reporte". El proceso tiene 4 pasos:
1. Información: seleccionar categoría y tipo de problema, escribir descripción y opcionalmente activar modo anónimo.
2. Ubicación: el sistema detecta automáticamente la ubicación mediante GPS.
3. Evidencia: adjuntar fotos del problema (opcional).
4. Confirmar: revisar toda la información antes de enviar.

Los tipos de problema disponibles por categoría son:
- Seguridad ciudadana: Robo o hurto, Presencia de pandillas, Violencia doméstica, Consumo de drogas en vía pública, Acoso callejero, Incidente de violencia, Persona en situación de calle, Otros problemas de seguridad
- Ambiente y limpieza: Acumulación de basura, Quema de residuos, Contaminación de agua, Ruido excesivo, Presencia de plagas, Microbasural, Residuos en espacios públicos, Otros problemas ambientales
- Infraestructura: Pista en mal estado, Vereda dañada, Alumbrado público defectuoso, Semáforo dañado, Puente o paso peatonal deteriorado, Fuga de agua, Colapso de desagüe, Otros problemas de infraestructura
- Movilidad y transporte: Vehículo abandonado, Señalización vial deteriorada, Paradero informal, Venta ambulante no autorizada, Obstáculo en vía pública, Exceso de velocidad, Estacionamiento indebido, Otros problemas de movilidad

Para avanzar entre pasos usar el botón "Siguiente". En el paso 4 el botón cambia a "Enviar reporte".
`;
}


  if (page === "home") {
    const topProblems = await prisma.report.groupBy({
      by: ["problemType"],
      _count: { problemType: true },
      orderBy: { _count: { problemType: "desc" } },
      take: 5,
    });
    pageContext = `
El usuario está en el panel principal (Home).
Problemas más reportados: ${topProblems.map((p) => `${p.problemType} (${p._count.problemType})`).join(", ")}
`;
  }

  const roleContext: Record<string, string> = {
    CITIZEN: "Eres un asistente amigable para ciudadanos de ReportaYa. Ayudas a entender cómo reportar problemas, consultar el estado de sus reportes y navegar la plataforma. Responde de forma simple y clara.",
    OPERATOR: "Eres un asistente para operadores municipales de ReportaYa. Ayudas a gestionar reportes, identificar prioridades, detectar patrones y tomar decisiones de validación. Responde de forma profesional y concisa.",
    TECHNICIAN: "Eres un asistente para técnicos de campo de ReportaYa. Ayudas a entender qué acciones tomar en cada tipo de problema, cómo registrar el trabajo y qué información documentar. Responde de forma práctica y directa.",
  };

  return `
${roleContext[role] || roleContext["CITIZEN"]}

DATOS ACTUALES DEL SISTEMA:
- Total de reportes: ${totalReports}
- Por estado: ${statusSummary}
- Por categoría: ${categorySummary}

${pageContext}

REGLAS:
- Responde siempre en español
- Sé conciso, máximo 3-4 oraciones por respuesta
- Si no tienes información suficiente, dilo claramente
- No inventes datos que no estén en el contexto
- Si el usuario pregunta algo fuera del sistema ReportaYa, redirige amablemente al tema
`.trim();
}

export async function chatWithGemini(
  message: string,
  history: { role: string; text: string }[],
  role: string,
  page: string,
  pageId?: string
): Promise<string> {

  const systemContext = await getSystemContext(role, page, pageId);

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemContext },
        ...history.map((h) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: h.text,
        })),
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Groq status:", response.status);
    console.error("Groq error:", error);
    throw new Error(`Groq error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No pude generar una respuesta.";
}