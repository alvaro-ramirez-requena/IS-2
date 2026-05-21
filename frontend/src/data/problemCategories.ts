export const problemCategories = [
  {
    value: "seguridad",
    label: "Seguridad ciudadana",
    options: [
      { value: "robos_asaltos", label: "Robos y asaltos" },
      { value: "alcohol_via_publica", label: "Consumo de alcohol en vía pública" },
      { value: "venta_ambulante", label: "Venta ambulante no autorizada" },
      { value: "personas_sospechosas", label: "Personas sospechosas" },
      { value: "ruidos_molestos", label: "Ruidos molestos" },
    ],
  },
  {
    value: "ambiente",
    label: "Ambiente y limpieza",
    options: [
      { value: "acumulacion_basura", label: "Acumulación de basura" },
      { value: "mal_olor", label: "Mal olor en la vía pública" },
      { value: "contaminacion_areas_verdes", label: "Contaminación de áreas verdes" },
      { value: "residuos_fuera_contenedores", label: "Residuos fuera de contenedores" },
      { value: "quema_residuos", label: "Quema de residuos" },
    ],
  },
  {
    value: "infraestructura",
    label: "Infraestructura y servicios",
    options: [
      { value: "alumbrado_defectuoso", label: "Alumbrado público defectuoso" },
      { value: "pistas_mal_estado", label: "Pistas en mal estado" },
      { value: "veredas_mal_estado", label: "Veredas en mal estado" },
      { value: "semaforos_inoperativos", label: "Semáforos inoperativos" },
      { value: "senalizacion_danada", label: "Señalización dañada" },
    ],
  },
  {
    value: "movilidad",
    label: "Movilidad y tránsito",
    options: [
      { value: "congestion_vehicular", label: "Congestión vehicular" },
      { value: "estacionamiento_prohibido", label: "Estacionamiento en zonas prohibidas" },
      { value: "transporte_deficiente", label: "Transporte público deficiente" },
      { value: "autos_abandonados", label: "Autos abandonados" },
      { value: "exceso_velocidad", label: "Exceso de velocidad" },
    ],
  },
] as const;