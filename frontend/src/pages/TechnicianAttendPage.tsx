import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    TechnicalAttentionService,
} from "../services/technicalAttention.service";

import {
    statusLabels,
} from "../utils/reportLabels";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type FieldType =
    "text" |
    "number" |
    "select" |
    "textarea";

type TemplateField = {
    name: string;
    label: string;
    placeholder?: string;
    type?: FieldType;
    options?: string[];
};

type AttentionTemplate = {
    title: string;
    description: string;
    categoryLabel: string;
    checklist: string[];
    fields: TemplateField[];
    actions: string[];
    results: string[];
};

type Report = {
    id: string;
    title: string;
    problemType: string;
    description: string;
    status: string;
    address?: string;
    priority?: string;
    latitude?: number;
    longitude?: number;
    municipality?: {
        id: string;
        name: string;
        district?: string | null;
        province?: string | null;
        department?: string | null;
    } | null;
    evidences?: {
        imageUrl: string;
    }[];
};

const defaultTemplate: AttentionTemplate = {
    title: "Atención técnica general",
    description:
        "Registra la atención realizada en campo cuando el problema no tiene una plantilla específica.",
    categoryLabel: "General",
    checklist: [
        "Verificar el estado actual del problema",
        "Registrar evidencia del área afectada",
        "Aplicar medida técnica correspondiente",
        "Confirmar si el caso requiere seguimiento",
    ],
    fields: [
        {
            name: "descripcionTecnica",
            label: "Descripción técnica",
            type: "textarea",
            placeholder: "Describe lo observado en campo.",
        },
        {
            name: "nivelRiesgo",
            label: "Nivel de riesgo",
            type: "select",
            options: [
                "Bajo",
                "Medio",
                "Alto",
            ],
        },
    ],
    actions: [
        "Atención realizada",
        "Mitigación temporal",
        "Derivar a otra área",
    ],
    results: [
        "Atendido parcialmente",
        "Atendido completamente",
        "Requiere seguimiento",
        "Requiere derivación",
    ],
};

const templates: Record<string, AttentionTemplate> = {
    robos_asaltos: {
        title: "Atención por robos y asaltos",
        description:
            "Permite registrar verificación en campo, coordinación preventiva y derivación a seguridad ciudadana.",
        categoryLabel: "Seguridad",
        checklist: [
            "Verificar el punto exacto del incidente",
            "Identificar si existe riesgo activo para vecinos o peatones",
            "Coordinar con serenazgo o seguridad ciudadana",
            "Registrar evidencia del área y condiciones del entorno",
        ],
        fields: [
            {
                name: "puntoCritico",
                label: "Punto crítico identificado",
                type: "text",
                placeholder: "Ej. Esquina sin iluminación, paradero o parque.",
            },
            {
                name: "nivelRiesgo",
                label: "Nivel de riesgo observado",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
            {
                name: "personasAfectadas",
                label: "Personas afectadas o testigos",
                type: "text",
                placeholder: "Ej. Vecinos, transeúntes, comerciantes.",
            },
        ],
        actions: [
            "Patrullaje preventivo",
            "Derivar a serenazgo",
            "Coordinar con PNP",
            "Reforzar vigilancia en la zona",
        ],
        results: [
            "Zona verificada",
            "Caso derivado a seguridad ciudadana",
            "Se requiere patrullaje recurrente",
            "Riesgo mitigado temporalmente",
        ],
    },

    alcohol_via_publica: {
        title: "Atención por consumo de alcohol en vía pública",
        description:
            "Registra acciones de control, verificación de convivencia vecinal y coordinación municipal.",
        categoryLabel: "Seguridad",
        checklist: [
            "Verificar presencia de personas consumiendo alcohol",
            "Evaluar afectación a vecinos o peatones",
            "Registrar evidencia del punto de concentración",
            "Coordinar intervención con fiscalización o serenazgo",
        ],
        fields: [
            {
                name: "cantidadPersonas",
                label: "Cantidad aproximada de personas",
                type: "number",
                placeholder: "Ej. 5",
            },
            {
                name: "afectacion",
                label: "Tipo de afectación",
                type: "select",
                options: [
                    "Ruido",
                    "Obstrucción de vía",
                    "Riesgo para peatones",
                    "Conducta agresiva",
                    "Otra",
                ],
            },
            {
                name: "horarioIncidencia",
                label: "Horario de mayor ocurrencia",
                type: "text",
                placeholder: "Ej. Noches, fines de semana.",
            },
        ],
        actions: [
            "Intervención preventiva",
            "Derivar a fiscalización",
            "Derivar a serenazgo",
            "Registrar zona para seguimiento",
        ],
        results: [
            "Personas retiradas",
            "Caso derivado",
            "Se requiere seguimiento nocturno",
            "Situación mitigada",
        ],
    },

    venta_ambulante: {
        title: "Atención por venta ambulante no autorizada",
        description:
            "Registra evaluación de ocupación de vía pública y acciones de fiscalización.",
        categoryLabel: "Seguridad / Fiscalización",
        checklist: [
            "Verificar ocupación de espacio público",
            "Identificar tipo de comercio informal",
            "Evaluar obstrucción peatonal o vehicular",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "tipoComercio",
                label: "Tipo de comercio",
                type: "text",
                placeholder: "Ej. Alimentos, ropa, accesorios.",
            },
            {
                name: "obstruccion",
                label: "Nivel de obstrucción",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
            {
                name: "ubicacionExacta",
                label: "Ubicación exacta",
                type: "text",
                placeholder: "Ej. Frente a mercado, esquina o paradero.",
            },
        ],
        actions: [
            "Notificación preventiva",
            "Derivar a fiscalización",
            "Retiro de comercio informal",
            "Programar nueva inspección",
        ],
        results: [
            "Comercio retirado",
            "Notificación emitida",
            "Caso derivado a fiscalización",
            "Requiere seguimiento",
        ],
    },

    personas_sospechosas: {
        title: "Atención por personas sospechosas",
        description:
            "Permite registrar verificación del entorno y coordinación preventiva con seguridad ciudadana.",
        categoryLabel: "Seguridad",
        checklist: [
            "Verificar presencia reportada",
            "Evaluar riesgo inmediato",
            "Registrar descripción general sin vulnerar privacidad",
            "Coordinar patrullaje o vigilancia preventiva",
        ],
        fields: [
            {
                name: "zonaObservada",
                label: "Zona observada",
                type: "text",
                placeholder: "Ej. Parque, esquina, paradero.",
            },
            {
                name: "riesgoPercibido",
                label: "Riesgo percibido",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
            {
                name: "medidaPreventiva",
                label: "Medida preventiva sugerida",
                type: "text",
                placeholder: "Ej. Patrullaje, iluminación, vigilancia.",
            },
        ],
        actions: [
            "Patrullaje preventivo",
            "Derivar a serenazgo",
            "Monitoreo de zona",
            "Sin intervención requerida",
        ],
        results: [
            "Zona verificada",
            "Patrullaje coordinado",
            "No se encontró riesgo activo",
            "Requiere seguimiento",
        ],
    },

    ruidos_molestos: {
        title: "Atención por ruidos molestos",
        description:
            "Registra verificación de ruido, horario, fuente probable y acción municipal correspondiente.",
        categoryLabel: "Seguridad / Convivencia",
        checklist: [
            "Identificar fuente probable del ruido",
            "Verificar horario y duración del ruido",
            "Evaluar afectación a vecinos o transeúntes",
            "Registrar evidencia o testimonio de la incidencia",
        ],
        fields: [
            {
                name: "fuenteRuido",
                label: "Fuente probable del ruido",
                type: "select",
                options: [
                    "Vivienda",
                    "Local comercial",
                    "Vehículo",
                    "Obra o construcción",
                    "Grupo de personas",
                    "Otra",
                ],
            },
            {
                name: "horarioRuido",
                label: "Horario de ocurrencia",
                type: "text",
                placeholder: "Ej. 10:00 p. m. a 1:00 a. m.",
            },
            {
                name: "nivelAfectacion",
                label: "Nivel de afectación",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
            {
                name: "zonaAfectada",
                label: "Zona afectada",
                type: "text",
                placeholder: "Ej. Manzana, edificio, parque o calle.",
            },
        ],
        actions: [
            "Advertencia preventiva",
            "Derivar a fiscalización",
            "Coordinar con serenazgo",
            "Programar medición o inspección",
        ],
        results: [
            "Ruido mitigado",
            "Advertencia registrada",
            "Caso derivado a fiscalización",
            "Requiere seguimiento en horario nocturno",
        ],
    },

    acumulacion_basura: {
        title: "Atención por acumulación de basura",
        description:
            "Registra volumen, punto exacto y acciones de limpieza o recojo.",
        categoryLabel: "Medio ambiente",
        checklist: [
            "Verificar volumen de residuos",
            "Identificar punto exacto de acumulación",
            "Confirmar si existe riesgo sanitario",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "volumenEstimado",
                label: "Volumen estimado",
                type: "text",
                placeholder: "Ej. 3 bolsas grandes o 2 m³.",
            },
            {
                name: "puntoExacto",
                label: "Punto exacto",
                type: "text",
                placeholder: "Ej. Frente al lote 15.",
            },
            {
                name: "riesgoSanitario",
                label: "Riesgo sanitario",
                type: "select",
                options: [
                    "Sin riesgo visible",
                    "Mal olor",
                    "Presencia de insectos",
                    "Presencia de roedores",
                    "Riesgo alto",
                ],
            },
        ],
        actions: [
            "Recojo de residuos",
            "Limpieza parcial",
            "Limpieza total",
            "Derivar a saneamiento urbano",
        ],
        results: [
            "Zona limpiada",
            "Residuos retirados parcialmente",
            "Se requiere unidad adicional",
            "Derivado a otra área",
        ],
    },

    mal_olor: {
        title: "Atención por mal olor en vía pública",
        description:
            "Permite registrar posible fuente del olor, nivel de afectación y acciones de saneamiento.",
        categoryLabel: "Medio ambiente",
        checklist: [
            "Identificar posible fuente del mal olor",
            "Verificar si hay residuos, aguas estancadas u otra causa visible",
            "Evaluar afectación a vecinos",
            "Registrar evidencia del área",
        ],
        fields: [
            {
                name: "fuenteProbable",
                label: "Fuente probable",
                type: "select",
                options: [
                    "Residuos",
                    "Desagüe",
                    "Agua estancada",
                    "Animal muerto",
                    "Origen no identificado",
                ],
            },
            {
                name: "intensidad",
                label: "Intensidad del olor",
                type: "select",
                options: [
                    "Baja",
                    "Media",
                    "Alta",
                ],
            },
            {
                name: "areaAfectada",
                label: "Área afectada",
                type: "text",
                placeholder: "Ej. Media cuadra, parque, esquina.",
            },
        ],
        actions: [
            "Limpieza de zona",
            "Derivar a saneamiento",
            "Coordinar inspección",
            "Aplicar medida temporal",
        ],
        results: [
            "Olor reducido",
            "Fuente identificada",
            "Caso derivado",
            "Requiere seguimiento",
        ],
    },

    areas_verdes: {
        title: "Atención por contaminación de áreas verdes",
        description:
            "Registra daño ambiental, tipo de contaminación y acción de recuperación.",
        categoryLabel: "Medio ambiente",
        checklist: [
            "Verificar área verde afectada",
            "Identificar tipo de contaminación o daño",
            "Evaluar riesgo para usuarios del espacio",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "tipoContaminacion",
                label: "Tipo de contaminación",
                type: "select",
                options: [
                    "Residuos sólidos",
                    "Daño a vegetación",
                    "Quema",
                    "Agua contaminada",
                    "Otro",
                ],
            },
            {
                name: "areaComprometida",
                label: "Área comprometida",
                type: "text",
                placeholder: "Ej. 10 m², jardín central, zona de juegos.",
            },
            {
                name: "riesgoUsuarios",
                label: "Riesgo para usuarios",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Limpieza de área verde",
            "Retiro de residuos",
            "Derivar a parques y jardines",
            "Aislar zona afectada",
        ],
        results: [
            "Área limpiada",
            "Área recuperada parcialmente",
            "Requiere mantenimiento adicional",
            "Derivado a parques y jardines",
        ],
    },

    residuos_contenedores: {
        title: "Atención por residuos fuera de contenedores",
        description:
            "Registra condiciones del contenedor, residuos externos y acción de recojo.",
        categoryLabel: "Medio ambiente",
        checklist: [
            "Verificar residuos fuera del contenedor",
            "Revisar si el contenedor está lleno o dañado",
            "Identificar punto exacto",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "estadoContenedor",
                label: "Estado del contenedor",
                type: "select",
                options: [
                    "Lleno",
                    "Dañado",
                    "Ausente",
                    "Operativo",
                ],
            },
            {
                name: "volumenExterno",
                label: "Volumen de residuos externos",
                type: "text",
                placeholder: "Ej. 5 bolsas, 1 m³.",
            },
            {
                name: "puntoExacto",
                label: "Punto exacto",
                type: "text",
                placeholder: "Ej. Al lado del contenedor principal.",
            },
        ],
        actions: [
            "Recojo de residuos externos",
            "Reposición o reparación de contenedor",
            "Limpieza de punto crítico",
            "Derivar a saneamiento urbano",
        ],
        results: [
            "Residuos retirados",
            "Contenedor reportado para reparación",
            "Zona limpiada",
            "Requiere recojo adicional",
        ],
    },

    quema_residuos: {
        title: "Atención por quema de residuos",
        description:
            "Registra verificación de quema, riesgo ambiental y medidas de mitigación.",
        categoryLabel: "Medio ambiente",
        checklist: [
            "Verificar evidencia de quema",
            "Evaluar presencia de humo o cenizas",
            "Identificar riesgo para vecinos",
            "Coordinar acción de mitigación o fiscalización",
        ],
        fields: [
            {
                name: "estadoQuema",
                label: "Estado de la quema",
                type: "select",
                options: [
                    "Activa",
                    "Finalizada",
                    "Restos de quema",
                ],
            },
            {
                name: "materialQuemado",
                label: "Material quemado",
                type: "text",
                placeholder: "Ej. Plástico, ramas, basura domiciliaria.",
            },
            {
                name: "riesgoAmbiental",
                label: "Riesgo ambiental",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Mitigación inmediata",
            "Derivar a fiscalización ambiental",
            "Limpieza de restos",
            "Registrar punto crítico",
        ],
        results: [
            "Quema controlada",
            "Zona limpiada",
            "Caso derivado",
            "Requiere seguimiento",
        ],
    },

    alumbrado_defectuoso: {
        title: "Atención por alumbrado público defectuoso",
        description:
            "Registra poste o luminaria afectada, tipo de falla y acción correctiva.",
        categoryLabel: "Infraestructura",
        checklist: [
            "Identificar poste o luminaria afectada",
            "Verificar si la falla es parcial o total",
            "Revisar riesgo para peatones o vehículos",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "codigoPoste",
                label: "Código o referencia del poste",
                type: "text",
                placeholder: "Ej. Poste frente al lote 20.",
            },
            {
                name: "tipoFalla",
                label: "Tipo de falla",
                type: "select",
                options: [
                    "Luz apagada",
                    "Luz intermitente",
                    "Cable expuesto",
                    "Poste dañado",
                    "Otro",
                ],
            },
            {
                name: "riesgoSeguridad",
                label: "Riesgo de seguridad",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Cambio de luminaria",
            "Revisión eléctrica",
            "Señalización preventiva",
            "Derivar a empresa eléctrica",
        ],
        results: [
            "Luminaria reparada",
            "Falla mitigada",
            "Requiere intervención externa",
            "Derivado a empresa eléctrica",
        ],
    },

    pistas_mal_estado: {
        title: "Atención por pistas en mal estado",
        description:
            "Registra dimensiones, riesgo vial y acción de reparación o señalización.",
        categoryLabel: "Infraestructura",
        checklist: [
            "Verificar estado de la pista",
            "Medir o estimar área afectada",
            "Evaluar riesgo para vehículos",
            "Señalizar la zona si corresponde",
        ],
        fields: [
            {
                name: "areaAfectada",
                label: "Área afectada",
                type: "text",
                placeholder: "Ej. 2 m² o tramo de 5 metros.",
            },
            {
                name: "tipoDano",
                label: "Tipo de daño",
                type: "select",
                options: [
                    "Bache",
                    "Grieta",
                    "Hundimiento",
                    "Desnivel",
                    "Otro",
                ],
            },
            {
                name: "riesgoVial",
                label: "Riesgo vial",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Señalización preventiva",
            "Reparación temporal",
            "Reparación definitiva",
            "Derivar a obras públicas",
        ],
        results: [
            "Zona señalizada",
            "Daño reparado temporalmente",
            "Daño reparado completamente",
            "Requiere maquinaria especializada",
        ],
    },

    veredas_mal_estado: {
        title: "Atención por veredas en mal estado",
        description:
            "Registra daño peatonal, nivel de riesgo y medida correctiva.",
        categoryLabel: "Infraestructura",
        checklist: [
            "Verificar daño en vereda",
            "Evaluar riesgo para peatones",
            "Identificar extensión del daño",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "tipoDano",
                label: "Tipo de daño",
                type: "select",
                options: [
                    "Rajadura",
                    "Hundimiento",
                    "Loseta rota",
                    "Obstrucción",
                    "Otro",
                ],
            },
            {
                name: "extension",
                label: "Extensión aproximada",
                type: "text",
                placeholder: "Ej. 2 metros lineales.",
            },
            {
                name: "riesgoPeatonal",
                label: "Riesgo peatonal",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Señalización preventiva",
            "Reparación temporal",
            "Derivar a obras públicas",
            "Retiro de obstrucción",
        ],
        results: [
            "Zona señalizada",
            "Vereda reparada temporalmente",
            "Caso derivado",
            "Riesgo mitigado",
        ],
    },

    semaforos_inoperativos: {
        title: "Atención por semáforos inoperativos",
        description:
            "Registra intersección, tipo de falla y acción de seguridad vial.",
        categoryLabel: "Infraestructura / Movilidad",
        checklist: [
            "Identificar intersección afectada",
            "Verificar tipo de falla",
            "Evaluar riesgo vehicular o peatonal",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "interseccion",
                label: "Intersección",
                type: "text",
                placeholder: "Ej. Av. Principal con Calle 5.",
            },
            {
                name: "tipoFalla",
                label: "Tipo de falla",
                type: "select",
                options: [
                    "Apagado total",
                    "Luz roja apagada",
                    "Luz amarilla apagada",
                    "Luz verde apagada",
                    "Intermitente",
                    "Otro",
                ],
            },
            {
                name: "riesgoVial",
                label: "Riesgo vial",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Señalización temporal",
            "Reinicio o revisión del semáforo",
            "Derivar a mantenimiento vial",
            "Coordinar apoyo de tránsito",
        ],
        results: [
            "Señalización instalada",
            "Falla corregida",
            "Requiere mantenimiento especializado",
            "Derivado a mantenimiento vial",
        ],
    },

    senalizacion_danada: {
        title: "Atención por señalización dañada",
        description:
            "Registra señal afectada, visibilidad y acción de reposición o reparación.",
        categoryLabel: "Infraestructura / Movilidad",
        checklist: [
            "Identificar señal dañada",
            "Evaluar visibilidad para peatones o conductores",
            "Verificar riesgo asociado",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "tipoSenal",
                label: "Tipo de señal",
                type: "text",
                placeholder: "Ej. Pare, cruce peatonal, límite de velocidad.",
            },
            {
                name: "estadoSenal",
                label: "Estado de la señal",
                type: "select",
                options: [
                    "Rota",
                    "Borrada",
                    "Inclinada",
                    "Ausente",
                    "Obstruida",
                ],
            },
            {
                name: "riesgo",
                label: "Riesgo asociado",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Reposición de señal",
            "Reparación de señal",
            "Señalización temporal",
            "Derivar a mantenimiento vial",
        ],
        results: [
            "Señal reparada",
            "Señal repuesta",
            "Zona señalizada temporalmente",
            "Requiere intervención adicional",
        ],
    },

    congestion_vehicular: {
        title: "Atención por congestión vehicular",
        description:
            "Registra punto de congestión, causa probable y medida de apoyo operativo.",
        categoryLabel: "Movilidad",
        checklist: [
            "Verificar punto de congestión",
            "Identificar causa probable",
            "Evaluar impacto en tránsito",
            "Coordinar apoyo operativo si corresponde",
        ],
        fields: [
            {
                name: "puntoCongestion",
                label: "Punto de congestión",
                type: "text",
                placeholder: "Ej. Cruce, avenida o paradero.",
            },
            {
                name: "causaProbable",
                label: "Causa probable",
                type: "select",
                options: [
                    "Obra",
                    "Accidente",
                    "Semáforo defectuoso",
                    "Estacionamiento indebido",
                    "Alta demanda vehicular",
                    "Otra",
                ],
            },
            {
                name: "nivelImpacto",
                label: "Nivel de impacto",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Apoyo de tránsito",
            "Ordenamiento temporal",
            "Derivar a movilidad urbana",
            "Monitoreo del punto",
        ],
        results: [
            "Flujo vehicular mejorado",
            "Caso derivado a movilidad",
            "Requiere intervención adicional",
            "Zona monitoreada",
        ],
    },

    estacionamiento_prohibido: {
        title: "Atención por estacionamiento en zona prohibida",
        description:
            "Registra ubicación, tipo de obstrucción y acción de fiscalización.",
        categoryLabel: "Movilidad",
        checklist: [
            "Verificar vehículo estacionado en zona prohibida",
            "Evaluar obstrucción vehicular o peatonal",
            "Registrar evidencia fotográfica",
            "Coordinar fiscalización si corresponde",
        ],
        fields: [
            {
                name: "tipoObstruccion",
                label: "Tipo de obstrucción",
                type: "select",
                options: [
                    "Vereda",
                    "Ciclovía",
                    "Paradero",
                    "Zona rígida",
                    "Entrada vehicular",
                    "Otra",
                ],
            },
            {
                name: "placaVisible",
                label: "Placa visible",
                type: "text",
                placeholder: "Ej. ABC-123 o no visible.",
            },
            {
                name: "riesgo",
                label: "Riesgo generado",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Notificación preventiva",
            "Derivar a fiscalización",
            "Solicitar retiro del vehículo",
            "Registrar reincidencia",
        ],
        results: [
            "Vehículo retirado",
            "Notificación emitida",
            "Caso derivado",
            "Requiere seguimiento",
        ],
    },

    transporte_publico: {
        title: "Atención por transporte público deficiente",
        description:
            "Registra problema observado, punto afectado y derivación a movilidad.",
        categoryLabel: "Movilidad",
        checklist: [
            "Verificar punto reportado",
            "Identificar tipo de deficiencia",
            "Evaluar afectación a usuarios",
            "Registrar evidencia o testimonio",
        ],
        fields: [
            {
                name: "tipoDeficiencia",
                label: "Tipo de deficiencia",
                type: "select",
                options: [
                    "Demora excesiva",
                    "Paradero informal",
                    "Mala conducta",
                    "Unidad en mal estado",
                    "Ruta deficiente",
                    "Otra",
                ],
            },
            {
                name: "puntoAfectado",
                label: "Punto afectado",
                type: "text",
                placeholder: "Ej. Paradero, avenida o cruce.",
            },
            {
                name: "impactoUsuarios",
                label: "Impacto en usuarios",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Derivar a movilidad urbana",
            "Registrar incidencia de ruta",
            "Coordinar inspección",
            "Monitorear punto",
        ],
        results: [
            "Caso derivado",
            "Punto monitoreado",
            "Inspección programada",
            "Requiere seguimiento",
        ],
    },

    autos_abandonados: {
        title: "Atención por autos abandonados",
        description:
            "Registra vehículo, ubicación, riesgo y acción de retiro o fiscalización.",
        categoryLabel: "Movilidad",
        checklist: [
            "Verificar presencia del vehículo",
            "Registrar ubicación exacta",
            "Evaluar obstrucción o riesgo",
            "Registrar evidencia fotográfica",
        ],
        fields: [
            {
                name: "placa",
                label: "Placa del vehículo",
                type: "text",
                placeholder: "Ej. ABC-123 o no visible.",
            },
            {
                name: "estadoVehiculo",
                label: "Estado del vehículo",
                type: "select",
                options: [
                    "Operativo aparente",
                    "Deteriorado",
                    "Sin llantas",
                    "Chatarra",
                    "Otro",
                ],
            },
            {
                name: "obstruccion",
                label: "Obstrucción o riesgo",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Notificación al propietario",
            "Derivar a fiscalización",
            "Coordinar retiro",
            "Registrar para seguimiento",
        ],
        results: [
            "Vehículo retirado",
            "Notificación emitida",
            "Caso derivado",
            "Requiere seguimiento",
        ],
    },

    exceso_velocidad: {
        title: "Atención por exceso de velocidad",
        description:
            "Registra punto de riesgo, horario y acción preventiva de movilidad.",
        categoryLabel: "Movilidad",
        checklist: [
            "Verificar punto de riesgo",
            "Identificar horario de mayor ocurrencia",
            "Evaluar riesgo para peatones",
            "Coordinar medida preventiva",
        ],
        fields: [
            {
                name: "puntoRiesgo",
                label: "Punto de riesgo",
                type: "text",
                placeholder: "Ej. Cruce escolar, avenida o curva.",
            },
            {
                name: "horarioFrecuente",
                label: "Horario frecuente",
                type: "text",
                placeholder: "Ej. 7:00 a. m. a 9:00 a. m.",
            },
            {
                name: "riesgoPeatonal",
                label: "Riesgo peatonal",
                type: "select",
                options: [
                    "Bajo",
                    "Medio",
                    "Alto",
                ],
            },
        ],
        actions: [
            "Señalización preventiva",
            "Derivar a movilidad urbana",
            "Coordinar control de velocidad",
            "Solicitar evaluación de reductores",
        ],
        results: [
            "Zona señalizada",
            "Caso derivado",
            "Control programado",
            "Requiere evaluación técnica",
        ],
    },
};

function normalizeText(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function getTemplateByProblemType(problemType: string) {
    const normalized =
        normalizeText(problemType);

    if (normalized.includes("robo") || normalized.includes("asalto")) return templates.robos_asaltos;
    if (normalized.includes("alcohol")) return templates.alcohol_via_publica;
    if (normalized.includes("venta ambulante")) return templates.venta_ambulante;
    if (normalized.includes("sospechosa")) return templates.personas_sospechosas;
    if (normalized.includes("ruido")) return templates.ruidos_molestos;

    if (normalized.includes("acumulacion") || normalized.includes("basura")) return templates.acumulacion_basura;
    if (normalized.includes("mal olor")) return templates.mal_olor;
    if (normalized.includes("area verde") || normalized.includes("areas verdes") || normalized.includes("contaminacion")) return templates.areas_verdes;
    if (normalized.includes("residuo") && normalized.includes("contenedor")) return templates.residuos_contenedores;
    if (normalized.includes("quema")) return templates.quema_residuos;

    if (normalized.includes("alumbrado")) return templates.alumbrado_defectuoso;
    if (normalized.includes("pista")) return templates.pistas_mal_estado;
    if (normalized.includes("vereda")) return templates.veredas_mal_estado;
    if (normalized.includes("semaforo")) return templates.semaforos_inoperativos;
    if (normalized.includes("senalizacion")) return templates.senalizacion_danada;

    if (normalized.includes("congestion")) return templates.congestion_vehicular;
    if (normalized.includes("estacionamiento")) return templates.estacionamiento_prohibido;
    if (normalized.includes("transporte publico")) return templates.transporte_publico;
    if (normalized.includes("auto") || normalized.includes("vehiculo abandonado")) return templates.autos_abandonados;
    if (normalized.includes("velocidad")) return templates.exceso_velocidad;

    return defaultTemplate;
}

export default function TechnicianAttendPage() {
    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [report, setReport] =
        useState<Report | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [checklist, setChecklist] =
        useState<Record<string, boolean>>({});

    const [fieldValues, setFieldValues] =
        useState<Record<string, string>>({});

    const [actionTaken, setActionTaken] =
        useState("");

    const [technicalResult, setTechnicalResult] =
        useState("");

    const [observations, setObservations] =
        useState("");

    const technicianId =
        localStorage.getItem("userId") || "";

    const template =
        useMemo(() => {
            return getTemplateByProblemType(
                report?.problemType || ""
            );
        }, [report?.problemType]);

    useEffect(() => {
        const fetchReport =
            async () => {
                try {
                    setLoading(true);

                    const response =
                        await fetch(
                            `${API_URL}/api/reports/${id}`
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data?.message ||
                            "No se pudo obtener el reporte."
                        );
                    }

                    setReport(data);

                } catch (error: any) {
                    setError(
                        error.message ||
                        "No se pudo cargar el reporte."
                    );

                } finally {
                    setLoading(false);
                }
            };

        fetchReport();
    }, [id]);

    useEffect(() => {
        const initialChecklist:
            Record<string, boolean> = {};

        const initialFields:
            Record<string, string> = {};

        template.checklist.forEach((item) => {
            initialChecklist[item] = false;
        });

        template.fields.forEach((field) => {
            initialFields[field.name] = "";
        });

        setChecklist(initialChecklist);
        setFieldValues(initialFields);
        setActionTaken("");
        setTechnicalResult("");
        setObservations("");
    }, [template]);

    const allChecklistCompleted =
        Object.values(checklist).length > 0 &&
        Object.values(checklist).every(Boolean);

    const allFieldsCompleted =
        template.fields.every((field) =>
            fieldValues[field.name]?.trim()
        );

    const canSubmit =
        allChecklistCompleted &&
        allFieldsCompleted &&
        actionTaken &&
        technicalResult &&
        !saving;

    const handleChecklistChange = (
        item: string
    ) => {
        setChecklist((prev) => ({
            ...prev,
            [item]: !prev[item],
        }));
    };

    const handleFieldChange = (
        fieldName: string,
        value: string
    ) => {
        setFieldValues((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!report) {
            return;
        }

        if (!technicianId) {
            setError(
                "No se encontró el técnico en sesión."
            );
            return;
        }

        if (report.status !== "IN_PROGRESS") {
            setError(
                "Solo puedes registrar atención cuando el reporte está en atención."
            );
            return;
        }

        if (!canSubmit) {
            setError(
                "Completa el checklist, los campos obligatorios, la acción y el resultado técnico."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            await TechnicalAttentionService.createAttention({
                reportId: report.id,
                technicianId,
                checklist,
                fieldValues,
                actionTaken,
                technicalResult,
                observations,
            });

            setSuccessMessage(
                "Atención técnica registrada correctamente."
            );

            setTimeout(() => {
                navigate(
                    `/technician/reports/${report.id}/fieldwork`
                );
            }, 1000);

        } catch (error: any) {
            setError(
                error.message ||
                "No se pudo registrar la atención técnica."
            );

        } finally {
            setSaving(false);
        }
    };

    const renderField = (
        field: TemplateField
    ) => {
        const value =
            fieldValues[field.name] || "";

        if (field.type === "textarea") {
            return (
                <textarea
                    value={value}
                    onChange={(event) =>
                        handleFieldChange(
                            field.name,
                            event.target.value
                        )
                    }
                    placeholder={field.placeholder}
                    className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        bg-white
                        min-h-[110px]
                        resize-none
                    "
                />
            );
        }

        if (field.type === "select") {
            return (
                <select
                    value={value}
                    onChange={(event) =>
                        handleFieldChange(
                            field.name,
                            event.target.value
                        )
                    }
                    className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        bg-white
                    "
                >
                    <option value="">
                        Selecciona una opción
                    </option>

                    {field.options?.map((option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={field.type === "number" ? "number" : "text"}
                value={value}
                onChange={(event) =>
                    handleFieldChange(
                        field.name,
                        event.target.value
                    )
                }
                placeholder={field.placeholder}
                className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    bg-white
                "
            />
        );
    };

    if (loading) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                text-3xl
                font-bold
            ">
                Cargando...
            </div>
        );
    }

    if (!report) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                text-3xl
                font-bold
            ">
                Reporte no encontrado
            </div>
        );
    }

    return (
        <div className="
            min-h-screen
            bg-[#F5F7FA]
            p-6
            lg:p-8
        ">
            <div className="
                max-w-7xl
                mx-auto
                space-y-8
            ">
                <button
                    onClick={() =>
                        navigate(
                            `/technician/reports/${report.id}`
                        )
                    }
                    className="
                        text-blue-700
                        font-semibold
                        hover:underline
                    "
                >
                    ← Volver al detalle
                </button>

                <section className="
                    bg-white
                    border
                    rounded-3xl
                    shadow-sm
                    p-6
                    lg:p-8
                    space-y-8
                ">
                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1fr_360px]
                        gap-8
                        items-start
                    ">
                        <div>
                            <p className="
                                text-green-700
                                font-semibold
                            ">
                                US17 - Atención técnica
                            </p>

                            <h1 className="
                                text-4xl
                                lg:text-5xl
                                font-bold
                                text-[#03152E]
                                mt-2
                                leading-tight
                            ">
                                {template.title}
                            </h1>

                            <p className="
                                text-gray-500
                                mt-4
                                max-w-3xl
                                text-lg
                                leading-relaxed
                            ">
                                {template.description}
                            </p>
                        </div>

                        <div className="
                            bg-blue-50
                            border
                            border-blue-100
                            rounded-2xl
                            p-5
                            space-y-3
                        ">
                            <h2 className="
                                font-bold
                                text-[#03152E]
                                text-lg
                            ">
                                Reporte atendido
                            </h2>

                            <p>
                                <strong>Título:</strong>{" "}
                                {report.title}
                            </p>

                            <p>
                                <strong>Tipo:</strong>{" "}
                                {report.problemType}
                            </p>

                            <p>
                                <strong>Categoría operativa:</strong>{" "}
                                {template.categoryLabel}
                            </p>

                            <p>
                                <strong>Estado:</strong>{" "}
                                {
                                    statusLabels[report.status] ||
                                    report.status
                                }
                            </p>

                            <p>
                                <strong>Prioridad:</strong>{" "}
                                {report.priority || "No definida"}
                            </p>

                            <p>
                                <strong>Municipalidad:</strong>{" "}
                                {
                                    report.municipality?.name ||
                                    "No definida"
                                }
                            </p>
                        </div>
                    </div>

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[340px_1fr]
                        gap-8
                    ">
                        <aside className="
                            space-y-6
                        ">
                            <div className="
                                bg-gray-50
                                border
                                rounded-2xl
                                p-5
                            ">
                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-[#03152E]
                                    mb-3
                                ">
                                    Resumen del reporte
                                </h2>

                                <p className="
                                    text-gray-600
                                    leading-relaxed
                                ">
                                    {report.description}
                                </p>

                                {report.address && (
                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-4
                                    ">
                                        <strong>Dirección:</strong>{" "}
                                        {report.address}
                                    </p>
                                )}
                            </div>

                            <div className="
                                bg-gray-50
                                border
                                rounded-2xl
                                p-5
                            ">
                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-[#03152E]
                                    mb-3
                                ">
                                    Evidencia inicial
                                </h2>

                                <img
                                    src={
                                        report.evidences?.[0]?.imageUrl ||
                                        "https://placehold.co/600x400?text=Sin+evidencia"
                                    }
                                    alt={report.problemType}
                                    className="
                                        w-full
                                        h-[220px]
                                        object-cover
                                        rounded-2xl
                                        border
                                    "
                                />
                            </div>
                        </aside>

                        <form
                            onSubmit={handleSubmit}
                            className="
                                grid
                                grid-cols-1
                                xl:grid-cols-2
                                gap-8
                            "
                        >
                            <section className="
                                space-y-6
                            ">
                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                        mb-4
                                    ">
                                        Checklist operativo
                                    </h2>

                                    <div className="
                                        space-y-3
                                    ">
                                        {template.checklist.map((item) => (
                                            <label
                                                key={item}
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                    bg-white
                                                    border
                                                    rounded-xl
                                                    p-4
                                                    cursor-pointer
                                                    hover:bg-gray-50
                                                "
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        checklist[item] ||
                                                        false
                                                    }
                                                    onChange={() =>
                                                        handleChecklistChange(
                                                            item
                                                        )
                                                    }
                                                    className="
                                                        mt-1
                                                    "
                                                />

                                                <span className="
                                                    text-gray-700
                                                ">
                                                    {item}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                        mb-4
                                    ">
                                        Acción técnica
                                    </h2>

                                    <label className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        mb-2
                                    ">
                                        Acción realizada
                                    </label>

                                    <select
                                        value={actionTaken}
                                        onChange={(event) =>
                                            setActionTaken(
                                                event.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-3
                                            bg-white
                                        "
                                    >
                                        <option value="">
                                            Selecciona una acción
                                        </option>

                                        {template.actions.map((action) => (
                                            <option
                                                key={action}
                                                value={action}
                                            >
                                                {action}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        mt-5
                                        mb-2
                                    ">
                                        Resultado técnico
                                    </label>

                                    <select
                                        value={technicalResult}
                                        onChange={(event) =>
                                            setTechnicalResult(
                                                event.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-3
                                            bg-white
                                        "
                                    >
                                        <option value="">
                                            Selecciona un resultado
                                        </option>

                                        {template.results.map((result) => (
                                            <option
                                                key={result}
                                                value={result}
                                            >
                                                {result}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </section>

                            <section className="
                                space-y-6
                            ">
                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                        mb-4
                                    ">
                                        Datos requeridos
                                    </h2>

                                    <div className="
                                        space-y-4
                                    ">
                                        {template.fields.map((field) => (
                                            <div key={field.name}>
                                                <label className="
                                                    block
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                    mb-2
                                                ">
                                                    {field.label}
                                                </label>

                                                {renderField(field)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="
                                    bg-gray-50
                                    border
                                    rounded-2xl
                                    p-6
                                ">
                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-[#03152E]
                                        mb-4
                                    ">
                                        Observaciones
                                    </h2>

                                    <textarea
                                        value={observations}
                                        onChange={(event) =>
                                            setObservations(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Agrega observaciones adicionales sobre la atención realizada."
                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-3
                                            bg-white
                                            min-h-[150px]
                                            resize-none
                                        "
                                    />
                                </div>

                                {error && (
                                    <div className="
                                        bg-red-50
                                        border
                                        border-red-200
                                        text-red-700
                                        rounded-2xl
                                        p-4
                                        font-semibold
                                    ">
                                        {error}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="
                                        bg-green-50
                                        border
                                        border-green-200
                                        text-green-700
                                        rounded-2xl
                                        p-4
                                        font-semibold
                                    ">
                                        {successMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="
                                        w-full
                                        bg-green-700
                                        text-white
                                        font-bold
                                        text-lg
                                        rounded-2xl
                                        py-4
                                        hover:bg-green-800
                                        transition
                                        disabled:bg-gray-300
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {
                                        saving
                                            ? "Guardando atención..."
                                            : "Registrar atención técnica"
                                    }
                                </button>

                                <p className="
                                    text-sm
                                    text-gray-500
                                    leading-relaxed
                                ">
                                    Esta acción registra la atención operativa del reporte. El cierre final se realiza en la siguiente historia.
                                </p>
                            </section>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}