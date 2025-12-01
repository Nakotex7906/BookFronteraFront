import { test, expect } from '@playwright/test';

test.describe('Flujo: Panel Admin (CRUD Salas)', () => {

    test.beforeEach(async ({ page }) => {
        // Mock ADMIN
        await page.route('**/api/v1/users/me', async route => {
            await route.fulfill({
                json: { id: 2, email: "admin@ufro.cl", nombre: "Admin", rol: "ADMIN" }
            });
        });


        await page.route('**/api/**/rooms', async route => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    json: [{ id: 1, name: "Sala Existente", capacity: 5, floor: 1, equipment: [] }]
                });
            } else {
                await route.fallback();
            }
        });
    });

    test('debe permitir crear una nueva sala', async ({ page }) => {
        // Preparamos el mock para el POST
        await page.route('**/api/**/rooms', async route => {
            if (route.request().method() === 'POST') {
                const data = route.request().postDataJSON();
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    json: { id: 2, ...data }
                });
            } else {
                await route.fallback();
            }
        });

        await page.goto('http://localhost:5173/admin/panel');

        // Abrir modal y llenar formulario
        await page.getByRole('button', { name: 'Nueva Sala' }).click();
        await page.getByPlaceholder('Ej: Sala de Estudio A').fill('Sala Nueva E2E');
        await page.locator('input[type="number"]').first().fill('10');

        //  Esperamos la petición
        const requestPromise = page.waitForRequest(request =>
            request.url().includes('/rooms') && request.method() === 'POST'
        );

        // Hacemos clic
        await page.getByRole('button', { name: 'Guardar Sala' }).click();

        //  Esperamos a que la petición sea capturada
        const request = await requestPromise;

        // Validamos
        const createdPayload = request.postDataJSON();
        expect(createdPayload).toBeTruthy();
        expect(createdPayload.name).toBe('Sala Nueva E2E');
    });

    test('debe eliminar una sala existente', async ({ page }) => {
        // Mock DELETE para ID 1
        await page.route('**/api/**/rooms/1', async route => {
            await route.fulfill({ status: 200 });
        });

        const deleteRequestPromise = page.waitForRequest(request =>
            request.url().includes('/rooms/1') && request.method() === 'DELETE'
        );

        await page.goto('http://localhost:5173/admin/panel');

        page.on('dialog', async dialog => await dialog.accept());

        await page.getByTitle('Eliminar').first().click();

        const deleteRequest = await deleteRequestPromise;
        expect(deleteRequest).toBeTruthy();
    });
});