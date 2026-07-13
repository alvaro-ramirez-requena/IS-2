import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { statusLabels } from "../utils/reportLabels";

import {
  validateTechnicianAttention,
} from "../utils/technicianAttend.utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Report = {
  id: string;
  title?: string;
  category: string;
  problemType: string;
  description: string;
  status: string;
  address?: string;
  createdAt: string;
  evidences?: {
    imageUrl: string;
  }[];
};

type CampoConfig = {
  label: string;
  placeholder: string;
  descripcion: string;
  minLength?: number;
};

type CatalogoAtencion = {
  checklist: string[];
  camposObligatorios: CampoConfig[];
  acciones: string[];
};

const catalogoAtencion: Record<string, CatalogoAtencion> = {
  "Robos y asaltos": {
    checklist: [
      "Verificar zona de incidencia",
      "Documentar frecuencia del problema",
      "Notificar a unidad de seguridad",
    ],
    camposObligatorios: [
      {
        label: "Zona de riesgo",
        placeholder: "Ej: Esquina de Av. Arequipa con Jr. Moquegua",
        descripcion: "Indica la calle o cruce donde ocurren los incidentes.",
        minLength: 10,
      },
      {
        label: "Frecuencia reportada",
        placeholder: "Ej: Todos los días entre 9pm y 12am",
        descripcion: "Horario o días en que suele ocurrir.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Coordinar con serenazgo",
      "Mitigación — Instalar cámara de vigilancia",
      "Derivación — Derivar a PNP",
    ],
  },

  "Consumo de alcohol en la vía pública": {
    checklist: [
      "Identificar personas involucradas",
      "Verificar si hay menores de edad",
      "Documentar hora y lugar exacto",
    ],
    camposObligatorios: [
      {
        label: "Número de personas",
        placeholder: "Ej: 4 personas en la vereda",
        descripcion: "Cantidad aproximada de personas involucradas.",
        minLength: 5,
      },
      {
        label: "Hora del incidente",
        placeholder: "Ej: Aproximadamente 10:30pm",
        descripcion: "Hora en que se encontró el problema.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Dispersar a las personas",
      "Mitigación — Llamar a serenazgo",
      "Derivación — Derivar a PNP",
    ],
  },

  "Venta ambulante no autorizada": {
    checklist: [
      "Identificar tipo de producto vendido",
      "Verificar si obstruye el paso peatonal",
      "Documentar ubicación exacta del puesto",
    ],
    camposObligatorios: [
      {
        label: "Tipo de comercio",
        placeholder: "Ej: Venta de comida en vereda frente al parque",
        descripcion: "Describe qué se vende y cómo está instalado.",
        minLength: 10,
      },
      {
        label: "Nivel de obstrucción",
        placeholder: "Ej: Bloquea el 50% de la vereda",
        descripcion: "Indica si impide el paso de peatones o vehículos.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Solicitar retiro del puesto",
      "Mitigación — Notificar a fiscalización",
      "Derivación — Derivar a municipio",
    ],
  },

  "Personas sospechosas": {
    checklist: [
      "Describir características de las personas",
      "Verificar si hay comportamiento amenazante",
      "Notificar a serenazgo de inmediato",
    ],
    camposObligatorios: [
      {
        label: "Descripción de las personas",
        placeholder: "Ej: 2 personas con capucha rondando el área",
        descripcion: "Características físicas o comportamiento observado.",
        minLength: 10,
      },
      {
        label: "Tiempo en el lugar",
        placeholder: "Ej: Llevan aproximadamente 1 hora en la zona",
        descripcion: "Cuánto tiempo llevan en el área según vecinos.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Coordinar patrullaje en la zona",
      "Mitigación — Aumentar presencia de serenazgo",
      "Derivación — Derivar a PNP",
    ],
  },

  "Ruidos molestos": {
    checklist: [
      "Identificar fuente del ruido",
      "Verificar horario de ocurrencia",
      "Medir nivel aproximado de ruido",
    ],
    camposObligatorios: [
      {
        label: "Fuente del ruido",
        placeholder: "Ej: Local de música en Jr. Lima 234",
        descripcion: "Indica de dónde proviene el ruido.",
        minLength: 10,
      },
      {
        label: "Horario del problema",
        placeholder: "Ej: Desde las 11pm hasta las 3am",
        descripcion: "En qué horario se produce el ruido.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Solicitar reducción de volumen",
      "Mitigación — Notificar a fiscalización",
      "Derivación — Derivar a policía",
    ],
  },

  "Acumulación de basura": {
    checklist: [
      "Verificar volumen acumulado",
      "Identificar punto crítico",
      "Tomar evidencia fotográfica",
    ],
    camposObligatorios: [
      {
        label: "Volumen estimado",
        placeholder: "Ej: 3 metros cúbicos aproximadamente",
        descripcion: "Estimación del tamaño o cantidad de residuos.",
        minLength: 5,
      },
      {
        label: "Punto exacto",
        placeholder: "Ej: Vereda frente al número 245 de Av. Lima",
        descripcion: "Ubicación precisa dentro de la dirección reportada.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Programar recojo",
      "Mitigación — Limpieza inmediata parcial",
      "Derivación — Área de limpieza municipal",
    ],
  },

  "Mal olor en la vía pública": {
    checklist: [
      "Identificar fuente del olor",
      "Verificar si hay residuos o aguas servidas",
      "Documentar zona afectada",
    ],
    camposObligatorios: [
      {
        label: "Fuente probable del olor",
        placeholder: "Ej: Desagüe tapado en la esquina de Av. Lima",
        descripcion: "Indica de dónde parece provenir el mal olor.",
        minLength: 10,
      },
      {
        label: "Extensión del área afectada",
        placeholder: "Ej: Media cuadra de Av. Lima",
        descripcion: "Cuánto espacio abarca el problema.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Limpiar la fuente del olor",
      "Mitigación — Aplicar desinfectante",
      "Derivación — Derivar a saneamiento",
    ],
  },

  "Contaminación de áreas verdes": {
    checklist: [
      "Verificar tipo de contaminación",
      "Identificar área afectada",
      "Documentar daño a la vegetación",
    ],
    camposObligatorios: [
      {
        label: "Tipo de contaminación",
        placeholder: "Ej: Vertido de aceite en el parque",
        descripcion: "Describe qué tipo de contaminante se encontró.",
        minLength: 10,
      },
      {
        label: "Área afectada",
        placeholder: "Ej: 20 metros cuadrados del parque central",
        descripcion: "Extensión aproximada del área contaminada.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Limpiar área contaminada",
      "Mitigación — Cercar zona afectada",
      "Derivación — Derivar a medio ambiente",
    ],
  },

  "Residuos fuera de contenedores": {
    checklist: [
      "Verificar estado del contenedor",
      "Estimar cantidad de residuos fuera",
      "Identificar si hay riesgo de salud",
    ],
    camposObligatorios: [
      {
        label: "Estado del contenedor",
        placeholder: "Ej: Contenedor lleno y desbordado",
        descripcion: "Describe el estado actual del contenedor.",
        minLength: 10,
      },
      {
        label: "Cantidad de residuos",
        placeholder: "Ej: 5 bolsas grandes fuera del contenedor",
        descripcion: "Estimación de residuos fuera del contenedor.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Recoger residuos y limpiar",
      "Mitigación — Colocar señalización",
      "Derivación — Solicitar vaciado urgente",
    ],
  },

  "Quema de residuos": {
    checklist: [
      "Verificar si el fuego está activo",
      "Identificar tipo de material quemado",
      "Evaluar riesgo de propagación",
    ],
    camposObligatorios: [
      {
        label: "Estado del incendio",
        placeholder: "Ej: Fuego controlado en contenedor de basura",
        descripcion: "Describe si el fuego está activo o ya apagado.",
        minLength: 10,
      },
      {
        label: "Material quemado",
        placeholder: "Ej: Bolsas de plástico y cartones",
        descripcion: "Tipo de residuos que se están quemando.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Apagar el fuego",
      "Mitigación — Llamar a bomberos",
      "Derivación — Derivar a defensa civil",
    ],
  },

  "Pistas en mal estado": {
    checklist: ["Evaluar extensión del daño", "Verificar riesgo vial", "Medir área afectada"],
    camposObligatorios: [
      {
        label: "Metros afectados",
        placeholder: "Ej: 15 metros lineales de pista dañada",
        descripcion: "Longitud aproximada del tramo en mal estado.",
        minLength: 5,
      },
      {
        label: "Nivel de riesgo",
        placeholder: "Ej: Alto — huecos de más de 20cm de profundidad",
        descripcion: "Indica si representa peligro inmediato.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Reparación en sitio",
      "Mitigación — Señalización temporal",
      "Derivación — Derivar a infraestructura",
    ],
  },

  "Alumbrado público defectuoso": {
    checklist: [
      "Identificar cantidad de postes afectados",
      "Verificar tipo de falla",
      "Revisar zona de cobertura",
    ],
    camposObligatorios: [
      {
        label: "Número de postes",
        placeholder: "Ej: 3 postes consecutivos sin luz",
        descripcion: "Cantidad de postes afectados en el tramo.",
        minLength: 5,
      },
      {
        label: "Tipo de falla",
        placeholder: "Ej: Lámpara quemada / cable cortado / poste dañado",
        descripcion: "Describe visualmente cuál es el problema.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Reemplazo de luminaria",
      "Mitigación — Revisión de cableado",
      "Derivación — Derivar a empresa eléctrica",
    ],
  },

  "Veredas en mal estado": {
    checklist: [
      "Evaluar extensión del daño",
      "Verificar riesgo para peatones",
      "Identificar causa del deterioro",
    ],
    camposObligatorios: [
      {
        label: "Metros afectados",
        placeholder: "Ej: 10 metros de vereda levantada",
        descripcion: "Longitud aproximada de la vereda dañada.",
        minLength: 5,
      },
      {
        label: "Tipo de daño",
        placeholder: "Ej: Losas levantadas por raíces de árbol",
        descripcion: "Describe qué tipo de daño presenta la vereda.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Reparar losas dañadas",
      "Mitigación — Señalizar zona peligrosa",
      "Derivación — Derivar a infraestructura",
    ],
  },

  "Semáforos inoperativos": {
    checklist: [
      "Verificar cuántos semáforos están afectados",
      "Evaluar riesgo de accidentes",
      "Coordinar tráfico manualmente si es necesario",
    ],
    camposObligatorios: [
      {
        label: "Semáforos afectados",
        placeholder: "Ej: 2 semáforos en la intersección de Av. Lima",
        descripcion: "Cantidad y ubicación de semáforos inoperativos.",
        minLength: 10,
      },
      {
        label: "Tipo de falla",
        placeholder: "Ej: Sin energía / pantalla rota / luces parpadeando",
        descripcion: "Describe qué falla presenta el semáforo.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Solicitar reparación técnica",
      "Mitigación — Control manual del tráfico",
      "Derivación — Derivar a empresa de señalización",
    ],
  },

  "Señalización dañada": {
    checklist: [
      "Identificar tipo de señal dañada",
      "Verificar si genera riesgo vial",
      "Documentar ubicación exacta",
    ],
    camposObligatorios: [
      {
        label: "Tipo de señal",
        placeholder: "Ej: Señal de pare caída / líneas de cruce borradas",
        descripcion: "Describe qué tipo de señalización está dañada.",
        minLength: 10,
      },
      {
        label: "Nivel de riesgo",
        placeholder: "Ej: Alto — señal irreconocible",
        descripcion: "Si la señal dañada representa riesgo inmediato.",
        minLength: 5,
      },
    ],
    acciones: [
      "Reparación — Reemplazar señal dañada",
      "Mitigación — Señalización temporal",
      "Derivación — Derivar a tránsito",
    ],
  },

  "Congestión vehicular": {
    checklist: [
      "Identificar causa de la congestión",
      "Estimar longitud de la cola vehicular",
      "Verificar si hay accidente involucrado",
    ],
    camposObligatorios: [
      {
        label: "Causa de la congestión",
        placeholder: "Ej: Obras en la vía reducen carriles",
        descripcion: "Describe qué está causando el problema de tráfico.",
        minLength: 10,
      },
      {
        label: "Impacto estimado",
        placeholder: "Ej: Cola de 3 cuadras, demora aproximada 20 min",
        descripcion: "Longitud de la cola y tiempo de demora estimado.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Desviar el tráfico",
      "Mitigación — Control manual del flujo",
      "Derivación — Derivar a policía de tránsito",
    ],
  },

  "Autos abandonados": {
    checklist: [
      "Verificar placa del vehículo",
      "Estimar tiempo de abandono",
      "Verificar si obstruye el tráfico",
    ],
    camposObligatorios: [
      {
        label: "Placa del vehículo",
        placeholder: "Ej: ABC-123 o sin placa visible",
        descripcion: "Número de placa del vehículo abandonado.",
        minLength: 5,
      },
      {
        label: "Tiempo de abandono",
        placeholder: "Ej: Vecinos indican que lleva 3 días ahí",
        descripcion: "Tiempo aproximado que lleva abandonado.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Solicitar grúa municipal",
      "Mitigación — Señalizar el vehículo",
      "Derivación — Derivar a policía de tránsito",
    ],
  },

  "Exceso de velocidad": {
    checklist: [
      "Identificar zona de riesgo",
      "Verificar señalización de velocidad",
      "Evaluar frecuencia del problema",
    ],
    camposObligatorios: [
      {
        label: "Zona de riesgo",
        placeholder: "Ej: Cuadra 5 de Av. Lima frente al colegio",
        descripcion: "Indica el tramo donde se produce el exceso de velocidad.",
        minLength: 10,
      },
      {
        label: "Frecuencia del problema",
        placeholder: "Ej: Principalmente en horas de salida escolar",
        descripcion: "Cuándo o con qué frecuencia ocurre.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Instalar reductor de velocidad",
      "Mitigación — Colocar señalización adicional",
      "Derivación — Derivar a policía de tránsito",
    ],
  },

  "Estacionamiento en zonas prohibidas": {
    checklist: [
      "Verificar señalización de zona prohibida",
      "Documentar placa del vehículo",
      "Verificar si obstruye entrada o paso",
    ],
    camposObligatorios: [
      {
        label: "Placa del vehículo",
        placeholder: "Ej: XYZ-456",
        descripcion: "Número de placa del vehículo mal estacionado.",
        minLength: 5,
      },
      {
        label: "Tipo de obstrucción",
        placeholder: "Ej: Bloquea entrada de emergencias",
        descripcion: "Qué está obstruyendo el vehículo.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Solicitar retiro del vehículo",
      "Mitigación — Notificar al propietario",
      "Derivación — Derivar a policía de tránsito",
    ],
  },

  "Transporte público deficiente": {
    checklist: [
      "Identificar línea de transporte afectada",
      "Verificar tipo de deficiencia",
      "Documentar horario del problema",
    ],
    camposObligatorios: [
      {
        label: "Línea afectada",
        placeholder: "Ej: Ruta 5 — Av. Arequipa hacia Miraflores",
        descripcion: "Indica qué línea o ruta presenta el problema.",
        minLength: 10,
      },
      {
        label: "Tipo de deficiencia",
        placeholder: "Ej: Unidades en mal estado, baja frecuencia",
        descripcion: "Describe cuál es el problema con el servicio.",
        minLength: 10,
      },
    ],
    acciones: [
      "Reparación — Reportar a concesionaria",
      "Mitigación — Notificar a supervisión de transporte",
      "Derivación — Derivar a autoridad de transporte",
    ],
  },
};

const catalogoDefault: CatalogoAtencion = {
  checklist: [
    "Verificar incidencia en sitio",
    "Documentar hallazgos",
    "Tomar fotografías si es posible",
  ],
  camposObligatorios: [
    {
      label: "Observaciones de campo",
      placeholder: "Ej: Se encontró el problema tal como fue reportado.",
      descripcion: "Describe lo que encontraste al llegar al lugar.",
      minLength: 10,
    },
  ],
  acciones: [
    "Reparación — Evaluar situación",
    "Mitigación — Tomar medidas correctivas",
    "Derivación — Derivar si es necesario",
  ],
};

const resultadosTecnicos = [
  {
    valor: "Aparentemente resuelto",
    etiqueta: "Aparentemente resuelto",
  },
  {
    valor: "Parcialmente atendido",
    etiqueta: "Parcialmente atendido",
  },
  {
    valor: "Requiere intervención adicional",
    etiqueta: "Requiere intervención adicional",
  },
  {
    valor: "Caso derivado",
    etiqueta: "Caso derivado",
  },
  {
    valor: "No se pudo verificar",
    etiqueta: "No se pudo verificar",
  },
];

const pasosSidebar = [
  "Verificación en sitio",
  "Datos requeridos",
  "Acción realizada",
  "Resultado preliminar",
];

const campoExtra: CampoConfig = {
  label: "Observaciones adicionales",
  placeholder: "Ej: Detalles relevantes no cubiertos arriba, o N/A si no aplica.",
  descripcion: "Información adicional relevante para el caso.",
  minLength: 2,
};

export default function TechnicianAttendPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [savedMessage, setSavedMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [errores, setErrores] = useState<Record<string, string>>({});

  const [checklistCompletado, setChecklistCompletado] = useState<Record<string, boolean>>({});

  const [campos, setCampos] = useState<Record<string, string>>({});

  const [accionSeleccionada, setAccionSeleccionada] = useState("");

  const [resultadoSeleccionado, setResultadoSeleccionado] = useState("");

  const technicianId = localStorage.getItem("userId") || "";

  const catalogo = useMemo(() => {
    const base = report
      ? (catalogoAtencion[report.problemType] ?? catalogoDefault)
      : catalogoDefault;

    return {
      ...base,
      camposObligatorios: [...base.camposObligatorios, campoExtra],
    };
  }, [report]);

  const storageKey = `technician-attend-${id}`;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(`${API_URL}/api/reports/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "No se pudo cargar el reporte.");
        }

        setReport(data);
      } catch (error: any) {
        setErrorMessage(error.message || "No se pudo cargar el reporte.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  useEffect(() => {
    if (!report) {
      return;
    }

    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setChecklistCompletado(
          parsed.checklistCompletado ??
            catalogo.checklist.reduce(
              (acc, item) => ({
                ...acc,
                [item]: false,
              }),
              {}
            )
        );

        setCampos(
          parsed.campos ??
            catalogo.camposObligatorios.reduce(
              (acc, campo) => ({
                ...acc,
                [campo.label]: "",
              }),
              {}
            )
        );

        setAccionSeleccionada(parsed.accionSeleccionada ?? "");

        setResultadoSeleccionado(parsed.resultadoSeleccionado ?? "");

        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setChecklistCompletado(
      catalogo.checklist.reduce(
        (acc, item) => ({
          ...acc,
          [item]: false,
        }),
        {}
      )
    );

    setCampos(
      catalogo.camposObligatorios.reduce(
        (acc, campo) => ({
          ...acc,
          [campo.label]: "",
        }),
        {}
      )
    );
  }, [report, catalogo, storageKey]);

  useEffect(() => {
    if (!id || !report) {
      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        checklistCompletado,
        campos,
        accionSeleccionada,
        resultadoSeleccionado,
      })
    );
  }, [
    id,
    report,
    storageKey,
    checklistCompletado,
    campos,
    accionSeleccionada,
    resultadoSeleccionado,
  ]);

  const toggleChecklist = (item: string) => {
    setChecklistCompletado((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const validar = (): Record<string, string> => {
    return validateTechnicianAttention({
      camposObligatorios: catalogo.camposObligatorios,
      campos,
      accionSeleccionada,
      resultadoSeleccionado,
    });
  };

  const saveTechnicalAttention = async () => {
    if (!report) {
      return;
    }

    if (!technicianId) {
      throw new Error("No se encontró el técnico en sesión.");
    }

    const checklistPayload = catalogo.checklist.map((item) => ({
      item,
      checked: Boolean(checklistCompletado[item]),
    }));

    const response = await fetch(`${API_URL}/api/technical-attentions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportId: report.id,

        technicianId,

        checklist: checklistPayload,

        fieldValues: campos,

        actionTaken: accionSeleccionada,

        technicalResult: resultadoSeleccionado,

        observations: campos["Observaciones adicionales"] || undefined,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "No se pudo guardar la atención técnica.");
    }

    const statusResponse = await fetch(`${API_URL}/api/reports/${report.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "IN_PROGRESS",
      }),
    });

    const statusData = await statusResponse.json().catch(() => null);

    if (!statusResponse.ok) {
      throw new Error(
        statusData?.message || "La atención fue guardada, pero no se pudo actualizar el estado."
      );
    }

    localStorage.removeItem(storageKey);
  };

  const guardarYSalir = () => {
    if (!report) {
      return;
    }

    setErrores({});
    setErrorMessage("");

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        checklistCompletado,
        campos,
        accionSeleccionada,
        resultadoSeleccionado,
      })
    );

    setSavedMessage("El avance fue guardado como borrador.");

    setTimeout(() => {
      navigate(`/technician/reports/${report.id}`);
    }, 600);
  };

  const guardarYContinuar = async () => {
    if (!report) {
      return;
    }

    const nuevosErrores = validar();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setSaving(true);
      setErrores({});
      setErrorMessage("");
      setSavedMessage("");

      await saveTechnicalAttention();

      setSavedMessage("Atención guardada correctamente. Continuando a trazabilidad.");

      setTimeout(() => {
        navigate(`/technician/reports/${report.id}/fieldwork`);
      }, 800);
    } catch (error: any) {
      setErrorMessage(error.message || "No se pudo guardar la atención.");
    } finally {
      setSaving(false);
    }
  };

  const checklistMarcados = catalogo.checklist.filter((item) => checklistCompletado[item]).length;

  const camposCompletados = catalogo.camposObligatorios.filter((campo) =>
    Boolean(campos[campo.label]?.trim())
  ).length;

  const seccionesCompletadas = [
    checklistMarcados > 0,
    camposCompletados === catalogo.camposObligatorios.length,
    Boolean(accionSeleccionada),
    Boolean(resultadoSeleccionado),
  ].filter(Boolean).length;

  const porcentajeCompletado = Math.round((seccionesCompletadas / 4) * 100);

  if (loading) {
    return (
      <div
        className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
                px-6
            "
      >
        <div
          className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    px-10
                    py-8
                    text-center
                    shadow-sm
                "
        >
          <div
            className="
                        mx-auto
                        mb-4
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-emerald-100
                        border-t-emerald-600
                    "
          />

          <p
            className="
                        font-semibold
                        text-slate-800
                    "
          >
            Cargando atención técnica
          </p>

          <p
            className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
          >
            Recuperando la información del reporte.
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div
        className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
                px-6
            "
      >
        <div
          className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-red-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                "
        >
          <div
            className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-xl
                        font-bold
                        text-red-600
                    "
          >
            !
          </div>

          <h1
            className="
                        mt-4
                        text-xl
                        font-bold
                        text-slate-900
                    "
          >
            Reporte no encontrado
          </h1>

          <p
            className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-500
                    "
          >
            {errorMessage || "No se pudo recuperar el reporte solicitado."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/technician")}
            className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-emerald-600
                            px-4
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-emerald-700
                        "
          >
            Volver al panel técnico
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
            min-h-screen
            bg-slate-50
            lg:flex
        "
    >
      {/* Sidebar */}
      <aside
        className="
                border-b
                border-emerald-800
                bg-[#064E3B]
                text-white
                lg:sticky
                lg:top-0
                lg:h-screen
                lg:w-[290px]
                lg:shrink-0
                lg:border-b-0
                lg:border-r
            "
      >
        <div
          className="
                    flex
                    h-full
                    flex-col
                    px-5
                    py-5
                    lg:px-6
                    lg:py-7
                "
        >
          <div
            className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        lg:block
                    "
          >
            <h1
              className="
                            text-3xl
                            font-bold
                            tracking-tight
                        "
            >
              <span className="text-white">reporta</span>

              <span className="text-[#FACC15]">Ya</span>
            </h1>

            <span
              className="
                            rounded-full
                            bg-white/10
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-emerald-100
                            lg:hidden
                        "
            >
              Módulo técnico
            </span>
          </div>

          <div
            className="
                        mt-6
                        hidden
                        lg:block
                    "
          >
            <p
              className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-widest
                            text-emerald-200/70
                        "
            >
              Trabajo actual
            </p>

            <div
              className="
                            mt-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/10
                            p-4
                        "
            >
              <p
                className="
                                text-base
                                font-semibold
                                leading-snug
                            "
              >
                {report.problemType}
              </p>

              <p
                className="
                                mt-2
                                text-sm
                                leading-relaxed
                                text-white/60
                            "
              >
                {report.address || "Ubicación no disponible"}
              </p>

              <span
                className="
                                mt-4
                                inline-flex
                                rounded-full
                                border
                                border-emerald-300/20
                                bg-emerald-300
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-emerald-950
                            "
              >
                {statusLabels[report.status] || report.status}
              </span>
            </div>
          </div>

          <div
            className="
                        mt-7
                        hidden
                        lg:block
                    "
          >
            <div
              className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
            >
              <p
                className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-widest
                                text-emerald-200/70
                            "
              >
                Progreso
              </p>

              <span
                className="
                                text-sm
                                font-bold
                                text-emerald-200
                            "
              >
                {porcentajeCompletado}%
              </span>
            </div>

            <div
              className="
                            mt-3
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-white/10
                        "
            >
              <div
                className="
                                    h-full
                                    rounded-full
                                    bg-[#FACC15]
                                    transition-all
                                    duration-500
                                "
                style={{
                  width: `${porcentajeCompletado}%`,
                }}
              />
            </div>

            <div
              className="
                            mt-5
                            space-y-3
                        "
            >
              {pasosSidebar.map((paso, index) => {
                const completed = [
                  checklistMarcados > 0,
                  camposCompletados === catalogo.camposObligatorios.length,
                  Boolean(accionSeleccionada),
                  Boolean(resultadoSeleccionado),
                ][index];

                return (
                  <a
                    key={paso}
                    href={`#paso-${index + 1}`}
                    className={`
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                px-2
                                                py-2
                                                transition
                                                hover:bg-white/5
                                                ${completed ? "text-white" : "text-white/65"}
                                            `}
                  >
                    <span
                      className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                text-xs
                                                font-bold
                                                ${
                                                  completed
                                                    ? "bg-emerald-400 text-emerald-950"
                                                    : "bg-white/10 text-white"
                                                }
                                            `}
                    >
                      {completed ? "✓" : index + 1}
                    </span>

                    <span
                      className="
                                                text-sm
                                                font-medium
                                            "
                    >
                      {paso}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <div
            className="
                        mt-auto
                        hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        p-4
                        lg:block
                    "
          >
            <p
              className="
                            text-xs
                            leading-relaxed
                            text-white/55
                        "
            >
              Este registro es preliminar. El checklist funciona como guía operativa y no es
              obligatorio seleccionar todos los puntos.
            </p>
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <main
        className="
                min-w-0
                flex-1
            "
      >
        {/* Barra superior */}
        <header
          className="
                    sticky
                    top-0
                    z-30
                    border-b
                    border-slate-200
                    bg-white/95
                    backdrop-blur
                "
        >
          <div
            className="
                        mx-auto
                        flex
                        max-w-7xl
                        items-center
                        justify-between
                        gap-4
                        px-5
                        py-4
                        lg:px-8
                    "
          >
            <button
              type="button"
              onClick={() => navigate(`/technician/reports/${report.id}`)}
              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                text-emerald-700
                                transition
                                hover:bg-emerald-50
                                hover:text-emerald-800
                            "
            >
              <span aria-hidden="true">←</span>
              Volver al detalle del reporte
            </button>

            <span
              className="
                            hidden
                            rounded-full
                            bg-emerald-50
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-emerald-700
                            sm:inline-flex
                        "
            >
              Registro preliminar
            </span>
          </div>
        </header>

        <div
          className="
                    mx-auto
                    max-w-7xl
                    px-5
                    py-8
                    lg:px-8
                    lg:py-10
                "
        >
          {/* Cabecera */}
          <section
            className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
          >
            <div
              className="
                            grid
                            grid-cols-1
                            lg:grid-cols-[minmax(0,1fr)_360px]
                        "
            >
              <div
                className="
                                p-6
                                sm:p-8
                                lg:p-10
                            "
              >
                <span
                  className="
                                    inline-flex
                                    rounded-full
                                    bg-emerald-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-emerald-700
                                "
                >
                  Atención técnica
                </span>

                <h2
                  className="
                                    mt-5
                                    text-3xl
                                    font-bold
                                    leading-tight
                                    tracking-tight
                                    text-slate-950
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                >
                  Atender reporte
                </h2>

                <p
                  className="
                                    mt-4
                                    max-w-3xl
                                    text-base
                                    leading-7
                                    text-slate-500
                                    sm:text-lg
                                "
                >
                  Documenta lo que encontraste y realizaste en el lugar. Este registro continuará
                  posteriormente en la trazabilidad de campo.
                </p>
              </div>

              <div
                className="
                                border-t
                                border-slate-200
                                bg-[#064E3B]
                                p-6
                                text-white
                                lg:border-l
                                lg:border-t-0
                                lg:p-8
                            "
              >
                <p
                  className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-emerald-200
                                "
                >
                  Reporte actual
                </p>

                <h3
                  className="
                                    mt-3
                                    text-xl
                                    font-bold
                                    leading-snug
                                "
                >
                  {report.title || report.problemType}
                </h3>

                <p
                  className="
                                    mt-2
                                    text-sm
                                    text-white/65
                                "
                >
                  {report.problemType}
                </p>

                <div
                  className="
                                    mt-5
                                    rounded-2xl
                                    bg-white/10
                                    p-4
                                "
                >
                  <p
                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-white/45
                                    "
                  >
                    Ubicación
                  </p>

                  <p
                    className="
                                        mt-2
                                        text-sm
                                        leading-relaxed
                                        text-white/80
                                    "
                  >
                    {report.address || "Ubicación no disponible"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {errorMessage && (
            <div
              role="alert"
              className="
                                mt-6
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                px-5
                                py-4
                                text-sm
                                text-red-700
                            "
            >
              <span
                className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-red-100
                                font-bold
                            "
              >
                !
              </span>

              <div>
                <p className="font-semibold">No se pudo completar la operación</p>

                <p className="mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {savedMessage && (
            <div
              role="status"
              className="
                                mt-6
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-emerald-200
                                bg-emerald-50
                                px-5
                                py-4
                                text-sm
                                text-emerald-700
                            "
            >
              <span
                className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-emerald-600
                                font-bold
                                text-white
                            "
              >
                ✓
              </span>

              <div>
                <p className="font-semibold">Atención guardada</p>

                <p className="mt-1">{savedMessage}</p>
              </div>
            </div>
          )}

          <div
            className="
                        mt-6
                        space-y-6
                    "
          >
            {/* Paso 1 */}
            <section
              id="paso-1"
              className="
                                scroll-mt-24
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                sm:p-8
                            "
            >
              <div
                className="
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-sm
                                    font-bold
                                    ${
                                      checklistMarcados > 0
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#064E3B] text-white"
                                    }
                                `}
                >
                  {checklistMarcados > 0 ? "✓" : "1"}
                </span>

                <div>
                  <h3
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Verificación en sitio
                  </h3>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Marca únicamente los aspectos que pudiste comprobar en el lugar.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-3
                                lg:grid-cols-3
                            "
              >
                {catalogo.checklist.map((item) => {
                  const checked = Boolean(checklistCompletado[item]);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleChecklist(item)}
                      className={`
                                                    flex
                                                    min-h-20
                                                    items-start
                                                    gap-3
                                                    rounded-2xl
                                                    border
                                                    p-4
                                                    text-left
                                                    transition
                                                    ${
                                                      checked
                                                        ? "border-emerald-300 bg-emerald-50"
                                                        : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
                                                    }
                                                `}
                    >
                      <span
                        className={`
                                                    mt-0.5
                                                    flex
                                                    h-6
                                                    w-6
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border-2
                                                    transition
                                                    ${
                                                      checked
                                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                                        : "border-slate-300 bg-white"
                                                    }
                                                `}
                      >
                        {checked && (
                          <span
                            className="
                                                            text-xs
                                                            font-bold
                                                        "
                          >
                            ✓
                          </span>
                        )}
                      </span>

                      <span
                        className={`
                                                    text-sm
                                                    font-medium
                                                    leading-relaxed
                                                    ${
                                                      checked
                                                        ? "text-emerald-800"
                                                        : "text-slate-700"
                                                    }
                                                `}
                      >
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p
                className="
                                mt-4
                                text-xs
                                text-slate-400
                            "
              >
                {checklistMarcados} de {catalogo.checklist.length} verificaciones marcadas.
              </p>
            </section>

            {/* Paso 2 */}
            <section
              id="paso-2"
              className="
                                scroll-mt-24
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                sm:p-8
                            "
            >
              <div
                className="
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-sm
                                    font-bold
                                    ${
                                      camposCompletados === catalogo.camposObligatorios.length
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#064E3B] text-white"
                                    }
                                `}
                >
                  {camposCompletados === catalogo.camposObligatorios.length ? "✓" : "2"}
                </span>

                <div>
                  <h3
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Datos requeridos
                  </h3>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Registra los datos mínimos encontrados en campo para este tipo de incidencia.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-2
                            "
              >
                {catalogo.camposObligatorios.map((campo) => {
                  const isExtra = campo.label === campoExtra.label;

                  return (
                    <div key={campo.label} className={isExtra ? "md:col-span-2" : ""}>
                      <label
                        className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-800
                                                "
                      >
                        {campo.label}

                        <span
                          className="
                                                        ml-1
                                                        text-red-500
                                                    "
                        >
                          *
                        </span>
                      </label>

                      <p
                        className="
                                                    mt-1
                                                    text-xs
                                                    leading-relaxed
                                                    text-slate-400
                                                "
                      >
                        {campo.descripcion}
                      </p>

                      {isExtra ? (
                        <textarea
                          value={campos[campo.label] || ""}
                          onChange={(event) => {
                            setCampos((prev) => ({
                              ...prev,
                              [campo.label]: event.target.value,
                            }));

                            if (errores[campo.label]) {
                              setErrores((prev) => {
                                const next = {
                                  ...prev,
                                };

                                delete next[campo.label];

                                return next;
                              });
                            }
                          }}
                          placeholder={campo.placeholder}
                          className={`
                                                            mt-3
                                                            min-h-32
                                                            w-full
                                                            resize-y
                                                            rounded-2xl
                                                            border
                                                            bg-white
                                                            px-4
                                                            py-3
                                                            text-sm
                                                            leading-6
                                                            text-slate-700
                                                            outline-none
                                                            transition
                                                            placeholder:text-slate-400
                                                            focus:ring-2
                                                            ${
                                                              errores[campo.label]
                                                                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                                : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                                                            }
                                                        `}
                        />
                      ) : (
                        <input
                          type="text"
                          value={campos[campo.label] || ""}
                          onChange={(event) => {
                            setCampos((prev) => ({
                              ...prev,
                              [campo.label]: event.target.value,
                            }));

                            if (errores[campo.label]) {
                              setErrores((prev) => {
                                const next = {
                                  ...prev,
                                };

                                delete next[campo.label];

                                return next;
                              });
                            }
                          }}
                          placeholder={campo.placeholder}
                          className={`
                                                            mt-3
                                                            w-full
                                                            rounded-xl
                                                            border
                                                            bg-white
                                                            px-4
                                                            py-3
                                                            text-sm
                                                            text-slate-700
                                                            outline-none
                                                            transition
                                                            placeholder:text-slate-400
                                                            focus:ring-2
                                                            ${
                                                              errores[campo.label]
                                                                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                                : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
                                                            }
                                                        `}
                        />
                      )}

                      {errores[campo.label] && (
                        <p
                          className="
                                                        mt-2
                                                        text-xs
                                                        font-medium
                                                        text-red-500
                                                    "
                        >
                          {errores[campo.label]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Paso 3 */}
            <section
              id="paso-3"
              className="
                                scroll-mt-24
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                sm:p-8
                            "
            >
              <div
                className="
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-sm
                                    font-bold
                                    ${
                                      accionSeleccionada
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#064E3B] text-white"
                                    }
                                `}
                >
                  {accionSeleccionada ? "✓" : "3"}
                </span>

                <div>
                  <h3
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Acción técnica realizada
                  </h3>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Selecciona la intervención realizada o gestionada en el lugar.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-4
                                lg:grid-cols-3
                            "
              >
                {catalogo.acciones.map((accion) => {
                  const selected = accionSeleccionada === accion;

                  const [tipo, detalle] = accion.split(" — ");

                  return (
                    <button
                      key={accion}
                      type="button"
                      onClick={() => {
                        setAccionSeleccionada(accion);

                        if (errores["accion"]) {
                          setErrores((prev) => {
                            const next = {
                              ...prev,
                            };

                            delete next["accion"];

                            return next;
                          });
                        }
                      }}
                      className={`
                                                    min-h-32
                                                    rounded-2xl
                                                    border-2
                                                    p-5
                                                    text-left
                                                    transition
                                                    ${
                                                      selected
                                                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                                                        : errores["accion"]
                                                          ? "border-red-300 bg-white text-slate-700"
                                                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                                                    }
                                                `}
                    >
                      <div
                        className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                "
                      >
                        <div>
                          <p
                            className="
                                                            text-xs
                                                            font-bold
                                                            uppercase
                                                            tracking-wide
                                                            opacity-70
                                                        "
                          >
                            {tipo}
                          </p>

                          <p
                            className="
                                                            mt-2
                                                            text-sm
                                                            font-semibold
                                                            leading-relaxed
                                                        "
                          >
                            {detalle || accion}
                          </p>
                        </div>

                        <span
                          className={`
                                                        flex
                                                        h-6
                                                        w-6
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border-2
                                                        ${
                                                          selected
                                                            ? "border-white bg-white text-emerald-700"
                                                            : "border-slate-300 bg-white"
                                                        }
                                                    `}
                        >
                          {selected && "✓"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {errores["accion"] && (
                <p
                  className="
                                    mt-3
                                    text-xs
                                    font-medium
                                    text-red-500
                                "
                >
                  {errores["accion"]}
                </p>
              )}
            </section>

            {/* Paso 4 */}
            <section
              id="paso-4"
              className="
                                scroll-mt-24
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                sm:p-8
                            "
            >
              <div
                className="
                                flex
                                items-start
                                gap-4
                            "
              >
                <span
                  className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-sm
                                    font-bold
                                    ${
                                      resultadoSeleccionado
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#064E3B] text-white"
                                    }
                                `}
                >
                  {resultadoSeleccionado ? "✓" : "4"}
                </span>

                <div>
                  <h3
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        sm:text-2xl
                                    "
                  >
                    Evaluación preliminar
                  </h3>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        leading-relaxed
                                        text-slate-500
                                    "
                  >
                    Indica cómo quedó el caso. Esta evaluación será complementada en el cierre
                    formal.
                  </p>
                </div>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-3
                                md:grid-cols-2
                            "
              >
                {resultadosTecnicos.map((resultado) => {
                  const selected = resultadoSeleccionado === resultado.valor;

                  return (
                    <button
                      key={resultado.valor}
                      type="button"
                      onClick={() => {
                        setResultadoSeleccionado(resultado.valor);

                        if (errores["resultado"]) {
                          setErrores((prev) => {
                            const next = {
                              ...prev,
                            };

                            delete next["resultado"];

                            return next;
                          });
                        }
                      }}
                      className={`
                                                    flex
                                                    min-h-16
                                                    items-center
                                                    gap-3
                                                    rounded-2xl
                                                    border
                                                    px-4
                                                    py-3
                                                    text-left
                                                    transition
                                                    ${
                                                      selected
                                                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                                        : errores["resultado"]
                                                          ? "border-red-300 bg-white text-slate-700"
                                                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                                                    }
                                                `}
                    >
                      <span
                        className={`
                                                    flex
                                                    h-6
                                                    w-6
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border-2
                                                    ${
                                                      selected
                                                        ? "border-emerald-600 bg-emerald-600"
                                                        : "border-slate-300 bg-white"
                                                    }
                                                `}
                      >
                        {selected && (
                          <span
                            className="
                                                            h-2.5
                                                            w-2.5
                                                            rounded-full
                                                            bg-white
                                                        "
                          />
                        )}
                      </span>

                      <span
                        className={`
                                                    text-sm
                                                    ${selected ? "font-semibold" : "font-medium"}
                                                `}
                      >
                        {resultado.etiqueta}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errores["resultado"] && (
                <p
                  className="
                                    mt-3
                                    text-xs
                                    font-medium
                                    text-red-500
                                "
                >
                  {errores["resultado"]}
                </p>
              )}
            </section>

            {/* Acciones finales */}
            <section
              className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            sm:p-8
                        "
            >
              <div
                className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
              >
                <div>
                  <h3
                    className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    "
                  >
                    Guardar atención
                  </h3>

                  <p
                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                  >
                    Puedes volver al detalle o continuar directamente a la trazabilidad.
                  </p>
                </div>

                <span
                  className="
                                    rounded-full
                                    bg-slate-100
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                "
                >
                  {seccionesCompletadas}/4 secciones completas
                </span>
              </div>

              <div
                className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
              >
                <button
                  type="button"
                  onClick={guardarYSalir}
                  disabled={saving}
                  className="
                                        rounded-2xl
                                        border-2
                                        border-emerald-600
                                        bg-white
                                        px-5
                                        py-4
                                        text-base
                                        font-semibold
                                        text-emerald-700
                                        transition
                                        hover:bg-emerald-50
                                        disabled:cursor-not-allowed
                                        disabled:border-slate-200
                                        disabled:text-slate-400
                                    "
                >
                  {saving ? "Guardando..." : "Guardar y salir"}
                </button>

                <button
                  type="button"
                  onClick={guardarYContinuar}
                  disabled={saving}
                  className="
                                        rounded-2xl
                                        bg-[#064E3B]
                                        px-5
                                        py-4
                                        text-base
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-[#033D2E]
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-300
                                    "
                >
                  {saving ? "Guardando..." : "Guardar y continuar a trazabilidad →"}
                </button>
              </div>

              <p
                className="
                                mt-4
                                text-center
                                text-xs
                                leading-relaxed
                                text-slate-400
                            "
              >
                Este registro es preliminar. El cierre formal se realizará posteriormente.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
