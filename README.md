# BookFrontera (Frontend)

**BookFrontera** es la interfaz de usuario moderna y responsiva para el sistema de reservas de espacios universitarios.

Desarrollada con **React, TypeScript y Vite**, esta aplicación ofrece una experiencia de usuario fluida (SPA) para gestionar reservas. Utiliza **Tailwind CSS** para un diseño atómico y adaptable, y se comunica con el backend mediante una API RESTful. Incluye módulos para autenticación, visualización de horarios tipo calendario y un panel de administración.

## Despliegue

* **URL de Producción (Vercel):** [https://bookfrontera-fron.vercel.app/](https://bookfrontera-fron.vercel.app/)
* **Backend Requerido:** Asegúrate de que la API esté corriendo (local o remota) para que la aplicación funcione correctamente.

---

## Prerrequisitos

Para ejecutar este proyecto localmente necesitarás:

* **Node.js (v18+):** Entorno de ejecución para JavaScript.
* **npm (o yarn):** Gestor de paquetes.
* **Backend BookFrontera:** Debe estar ejecutándose en el puerto `8080` (por defecto) o en la URL que configures.

---

## Configuración del Entorno (.env)

El frontend necesita saber dónde está la API. Crea un archivo `.env` en la raíz del proyecto basándote en este ejemplo:

```properties
# .env
# URL base de la API del Backend (sin la barra final si es posible, aunque el código lo maneja)
VITE_API_URL=http://localhost:8080/api/v1
```

## Ejecucion local
Sigue estos pasos para levantar el entorno de desarrollo:

1. Instalar Dependencias
   Ejecuta en la raíz del proyecto para descargar todas las librerías necesarias (React, Tailwind, Lucide, etc.):
```
npm install
```
2. Iniciar Servidor de Desarrollo
   Levanta el servidor rápido de Vite con recarga en caliente (HMR):
```
npm run dev
```
La aplicación estará disponible inmediatamente en: http://localhost:5173

# Ejecutar Pruebas 
El proyecto cuenta con dos tipos de pruebas para asegurar la calidad del código: Unitarias y End-to-End (E2E).

Pruebas Unitarias (Vitest)
Utilizamos Vitest junto con React Testing Library para probar componentes aislados, hooks y utilidades.
```
# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas con reporte de cobertura (Coverage)
npm run test:coverage
```
Pruebas E2E (Playwright)
Utilizamos Playwright para simular flujos completos de usuario (Login, Reservar, Admin Panel).
```
# Ejecutar los tests E2E (asegúrate de tener el backend y frontend corriendo)
npx playwright test
```
