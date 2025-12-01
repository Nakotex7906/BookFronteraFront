import { test, expect } from '@playwright/test';

test.describe('Flujo: Mis Reservas (Usuario)', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Usuario
        await page.route('**/api/**/users/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: { id: 1, email: "user@ufro.cl", nombre: "Usuario Test", rol: "STUDENT" }
            });
        });

        // Mock GET Reservas
        await page.route('**/api/**/reservations/my-reservations', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: {
                    current: null,
                    past: [],
                    future: [{
                        id: 999,
                        startAt: "2025-12-25T10:00:00",
                        endAt: "2025-12-25T11:00:00",
                        room: { id: 1, name: "Sala Beta", imageUrl: "" },
                        user: { id: 1, nombre: "Usuario Test" }
                    }]
                }
            });
        });

        // Mock DELETE Reserva
        await page.route('**/api/**/reservations/999', async route => {
            await route.fulfill({ status: 204 });
        });
    });

    test('debe mostrar reservas futuras y cancelar una al aceptar la alerta', async ({ page }) => {
        await page.goto('http://localhost:5173/mis-reservas');

        // Verificar que la reserva aparece
        await expect(page.getByText('Sala Beta')).toBeVisible();

        // Preparar el manejo del diálogo (window.confirm)
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        // Hacer clic en Cancelar
        await page.getByRole('button', { name: 'Cancelar' }).click();

    });
});