# Consultorio Jurídico - UAC

Este es un proyecto dedicado a la gestión de un Consultorio Jurídico, construido con un stack moderno y eficiente.

## Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/)
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## Requisitos Previos

Asegúrate de tener instalado:

- Node.js (versión recomendada v20+)
- pnpm (`npm install -g pnpm`)
- Docker (necesario para correr Supabase localmente)

## Configuración Local

Sigue estos pasos para iniciar el proyecto en tu máquina local:

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Iniciar Supabase

Este comando iniciará los contenedores de Docker necesarios para la base de datos, auth, y demás servicios de Supabase.

```bash
pnpm supabase start
```

### 3. Ejecutar Migraciones

Para asegurar que tu base de datos local tenga la estructura correcta (tablas, enums, políticas de seguridad), ejecuta:

```bash
pnpm supabase db reset
```

_Nota: Este comando borra los datos existentes y vuelve a aplicar todas las migraciones._

### 4. Ejecutar el Seed

Para poblar la base de datos con datos de prueba iniciales:

```bash
npx tsx seed.ts
```

### 5. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

- `app/`: Contiene las rutas y componentes de Next.js.
- `supabase/migrations/`: Scripts SQL para la estructura de la base de datos.
- `seed.ts`: Script para cargar datos iniciales.

## Notas Adicionales

- Si realizas cambios en la estructura de la base de datos, recuerda crear una nueva migración:
  ```bash
  pnpm supabase migration new nombre_de_la_migracion
  ```
- Para ver el Dashboard de Supabase local: [http://localhost:54323](http://localhost:54323)
