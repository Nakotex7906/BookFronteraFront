import { test, expect } from '@playwright/test';

test.describe('Prueba E2E Panel de Administración', () => {

    // Se utiliza la sesión guardada previamente para saltar el login
    test.use({ storageState: 'playwright/.auth/admin.json' });

    // Se generan nombres únicos para no afectar datos reales
    const TIMESTAMP = Date.now();
    const ROOM_NAME = `Sala Test ${TIMESTAMP}`;
    const EDITED_NAME = `SALA-ACTUALIZADA-${TIMESTAMP}`;

    test('Ciclo de vida completo: Crear, Editar y Borrar una sala real', async ({ page }) => {
        // Se navega al panel de administración
        await page.goto('http://localhost:5173/admin/panel');
        await expect(page.getByRole('heading', { name: 'Gestión de Salas' })).toBeVisible();

        // ----------------------------------------------------------------
        // 1. CREAR SALA
        // ----------------------------------------------------------------

        console.log(`Creando sala: ${ROOM_NAME}`);
        await page.getByRole('button', { name: 'Nueva Sala' }).click();

        // Se llenan los datos del formulario
        await page.getByPlaceholder('Ej: Sala de Estudio A').fill(ROOM_NAME);
        await page.locator('input[type="number"]').first().fill('5');
        await page.locator('input[type="number"]').nth(1).fill('1');

        await page.getByRole('button', { name: 'Guardar Sala' }).click();

        // Se espera a que el modal desaparezca y la tabla se actualice
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText(ROOM_NAME, { exact: true })).toBeVisible();


        // ----------------------------------------------------------------
        // 2. EDITAR LA SALA RECIÉN CREADA
        // ----------------------------------------------------------------

        console.log(`Editando sala...`);

        // Se busca la fila específica que creamos para evitar editar otra
        const row = page.locator('tr', { hasText: ROOM_NAME });
        await row.getByTitle('Editar datos').click();

        // Se asegura que estamos escribiendo en el input del modal y no en el buscador
        const nameInput = page.getByPlaceholder('Ej: Sala de Estudio A');
        await expect(nameInput).toBeVisible();
        await nameInput.fill(EDITED_NAME);

        await page.getByRole('button', { name: 'Guardar Sala' }).click();

        // Se espera que termine la carga y se cierre el modal
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText('Cargando información...')).not.toBeVisible();

        // Se verifica que el nombre antiguo ya no esté y aparezca el nuevo
        await expect(page.getByText(ROOM_NAME)).not.toBeVisible();
        await expect(page.getByText(EDITED_NAME)).toBeVisible();


        // ----------------------------------------------------------------
        // 3. ELIMINAR LA SALA PARA LIMPIAR DATOS
        // ----------------------------------------------------------------

        console.log(`Eliminando sala para limpiar...`);

        const rowEdited = page.locator('tr', { hasText: EDITED_NAME });

        // Se configura el listener para aceptar la alerta del navegador
        page.once('dialog', async dialog => await dialog.accept());
        await rowEdited.getByTitle('Eliminar sala').click();

        // Se confirma que la sala se haya eliminado de la lista
        await expect(page.getByText(EDITED_NAME)).not.toBeVisible();
    });
});