import { test, expect } from '@playwright/test';

/**
 * Test Suite: Flujo de Reserva desde el Home.
 */
test.describe('Flujo: Realizar Reserva (Home)', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Usuario
        await page.route('**/api/**/users/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: { id: 1, email: "student@ufro.cl", nombre: "Estudiante", rol: "STUDENT" }
            });
        });

        // Mock Disponibilidad
        await page.route('**/api/**/availability*', async route => {
            await route.fulfill({
                contentType: 'application/json',
                json: {
                    rooms: [{ id: 10, name: "Sala de Estudio 10", capacity: 6, equipment: ["Wifi"] }],
                    slots: [{ id: "10:00-11:00", label: "10:00 - 11:00", start: "10:00", end: "11:00" }],
                    availability: [{ roomId: "10", slotId: "10:00-11:00", available: true }]
                }
            });
        });

        //  Mock POST Reserva
        await page.route('**/api/**/reservations', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    json: { id: "res-123", status: "CONFIRMED" }
                });
            } else {
                await route.fallback();
            }
        });
    });

    test('debe seleccionar un bloque disponible y confirmar la reserva', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Verificar que cargó el grid
        await expect(page.getByText('Sala de Estudio 10')).toBeVisible();

        // Buscar el botón del bloque disponible
        const slotButton = page.getByTitle(/Sala de Estudio 10.*Disponible/);
        await expect(slotButton).toBeEnabled();
        await slotButton.click();

        // Verificar Modal
        await expect(page.getByText('Confirmar Reserva')).toBeVisible();

        // Confirmar la acción
        await page.getByRole('button', { name: 'Confirmar' }).click();

        // Verificar redirección
        await expect(page).toHaveURL(/.*\/reservation-success/);
        await expect(page.getByText('¡Reserva Confirmada!')).toBeVisible();
    });
});