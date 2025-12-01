import { test, expect } from '@playwright/test';

test.describe('Flujo: Búsqueda de Salas (Usuario Logueado)', () => {

    test.beforeEach(async ({ page }) => {
        //  MOCK DE AUTENTICACIÓN
        await page.route('**/api/v1/users/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: {
                    id: 1,
                    email: "test@ufromail.cl",
                    nombre: "UsuarioPrueba",
                    rol: "STUDENT"
                }
            });
        });

        //  MOCK DE DISPONIBILIDAD
        await page.route('**/api/v1/availability*', async route => {
            await route.fulfill({
                contentType: 'application/json',
                json: {
                    rooms: [
                        { id: 1, name: "Sala E2E Alpha", capacity: 4, equipment: ["Pizarra"], floor: 1 },
                        { id: 2, name: "Sala E2E Beta", capacity: 8, equipment: ["TV"], floor: 2 }
                    ],
                    slots: [
                        { id: "08:30-09:30", label: "08:30 - 09:30", start: "08:30", end: "09:30" }
                    ],
                    availability: [
                        { roomId: "1", slotId: "08:30-09:30", available: true },
                        { roomId: "2", slotId: "08:30-09:30", available: true }
                    ]
                }
            });
        });
    });

    test('debe navegar a Salas de Estudio y filtrar resultados', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await expect(page.getByText('UsuarioPrueba')).toBeVisible();

        await page.getByRole('link', { name: 'Salas de Estudio' }).first().click();
        await expect(page).toHaveURL(/.*\/salas-de-estudio/);

        //  Clic en Buscar para cargar la lista inicial
        await page.getByRole('button', { name: 'Buscar' }).click();

        await expect(page.getByText('Sala E2E Alpha')).toBeVisible();

        const capacitySelect = page.locator('div')
            .filter({ has: page.locator('label', { hasText: /^Capacidad$/i }) })
            .last();

        // 2. Hacemos clic en el botón (forzado por seguridad)
        await capacitySelect.getByRole('button').click();

        // 3. Seleccionamos la opción "6 Personas"
        await page.getByText('6 Personas').click();
        // presionar el boton de buscar de nuevo para actualizar el resultado
        await page.getByRole('button', { name: 'Buscar' }).click();

        await expect(page.getByText('Sala E2E Alpha')).not.toBeVisible();
        await expect(page.getByText('Sala E2E Beta')).toBeVisible();
    });
});