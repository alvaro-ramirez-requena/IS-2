# Integración HU15/HU21 sobre GonzaloPazRelease2

Esta versión parte de `IS-2-GonzaloPazRelease2` e integra de forma manual las funcionalidades de HU15/HU21 del ZIP `IS-2-feature-HU15-HU21`, sin reemplazar los módulos que ya tenía Gonzalo.

## Integrado

- Backend de asignaciones de reportes a técnicos:
  - `/api/assignments`
  - `/api/assignments/technicians`
  - `/api/assignments/report/:reportId`
  - `/api/assignments/reassign`
- Catálogos operativos:
  - categorías
  - tipos de problema
  - motivos de cierre
  - configuraciones SLA
- Modelo Prisma para:
  - `ReportAssignment`
  - `Category`
  - `ProblemType`
  - `ClosureReason`
  - `SlaConfiguration`
- Frontend de asignación en `OperatorReportDetailPage`.
- Adaptación de técnicos para usar `TechnicianProfile` existente en la rama de Gonzalo.

## Comandos recomendados

```cmd
cd backend
npm install
npx prisma db push --force-reset
npx prisma generate
npx ts-node-dev --transpile-only src/scripts/createOperator.ts
npx ts-node-dev --transpile-only src/scripts/createTechnician.ts
npx ts-node-dev --transpile-only src/scripts/createTechnician2.ts
npx ts-node-dev --transpile-only src/scripts/seedOperationalCatalogs.ts
npm run dev
```

En otra terminal:

```cmd
cd frontend
npm install
npm run dev
```

## Flujo de prueba

1. Crear reporte ciudadano.
2. Aprobar reporte como operador.
3. Priorizar reporte.
4. Entrar al detalle del reporte priorizado.
5. Asignar técnico desde la sección “Asignación de Técnico”.
6. Verificar que el reporte pase a `ASSIGNED`.
