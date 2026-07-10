# Corrección de inicio de sesión del operador

El error de consola tenía dos partes:

1. `401 Unauthorized` en `/api/auth/login`: el usuario operador no existe, no está verificado, o la contraseña no coincide.
2. `reports.map is not a function`: el frontend intentaba hacer `.map()` sobre un objeto de error devuelto por el backend, no sobre un arreglo.

## Pasos recomendados

Desde la carpeta `backend`:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run create:operator
npm run dev
```

Luego entra con:

```txt
Correo: operador@municipalidad.com
Contraseña: Operador123!
```

En otra terminal, desde `frontend`:

```bash
npm install
npm run dev
```

También se corrigió `OperatorDashboardPage.tsx` para que no reviente con `reports.map` cuando el backend responde un error.
