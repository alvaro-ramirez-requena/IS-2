# Integración GonzaloPaz Release 2 + HU14

Esta versión usa como base `IS-2-GonzaloPazRelease2` porque contiene las historias 13, 23 y 24, y se le integró la funcionalidad de HU14 desde `IS-2-HU14`.

## Cambios integrados de HU14

- Se añadieron campos de priorización al modelo `Report`:
  - `priority`
  - `impact`
  - `probability`
  - `operationalType`
  - `targetDate`
  - `justification`
- Se añadió el enum `Priority` con valores `BAJO`, `MEDIO` y `ALTO`.
- Se añadió la migración `20260707193000_merge_hu14_prioritization`.
- Se añadió el endpoint:
  - `PATCH /api/reports/:id/prioritize`
- Se agregó lógica para calcular prioridad automáticamente según impacto y probabilidad.
- Se mantiene la lógica de notificaciones de la versión de Gonzalo al priorizar un reporte.
- Se actualizó la vista `OperatorReportDetailPage.tsx` para que el operador pueda aprobar/rechazar y, si el reporte está aprobado, priorizarlo.
- Se actualizó `OperatorDashboardPage.tsx` para mostrar la sección de reportes priorizados y la etiqueta de prioridad.

## Comandos recomendados

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Verificación realizada

- Se verificó que el frontend compile correctamente con `npm run build`.
- No pude completar `npx prisma generate` en este entorno porque Prisma intentó descargar binaries desde `binaries.prisma.sh` y el sandbox no tiene acceso de red estable. En una máquina local con internet debería ejecutarse normalmente.
