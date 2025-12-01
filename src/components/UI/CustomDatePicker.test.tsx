import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CustomDatePicker } from './CustomDatePicker';

describe('Componente: CustomDatePicker', () => {
    it('debe mostrar la fecha formateada y el label correctamente', () => {
        render(
            <CustomDatePicker
                label="Fecha de Reserva"
                value="2025-11-20"
                onChange={() => {}}
            />
        );

        expect(screen.getByText(/FECHA DE RESERVA/i)).toBeInTheDocument();
        expect(screen.getByText("20/11/2025")).toBeInTheDocument();
    });

    it('debe llamar a onChange con el formato correcto al seleccionar un día', () => {
        const handleChange = vi.fn();
        render(<CustomDatePicker value="2025-11-20" onChange={handleChange} />);

        const triggerBtn = screen.getByText("20/11/2025");
        fireEvent.click(triggerBtn);

        const dayButton = screen.getByRole('button', { name: "25" });
        fireEvent.click(dayButton);

        expect(handleChange).toHaveBeenCalledWith("2025-11-25");
    });

    it('debe cerrarse al hacer clic fuera', () => {
        render(<CustomDatePicker value="2025-11-20" onChange={() => {}} />);

        const triggerBtn = screen.getByText("20/11/2025");
        fireEvent.click(triggerBtn);

        // Verificamos que al abrir Nno tenga la clase de oculto
        const header = screen.getByText("Noviembre 2025");
        const dropdownContainer = header.closest('.absolute');

        expect(dropdownContainer).not.toHaveClass("opacity-0");

        // Simular clic fuera
        fireEvent.mouseDown(document.body);

        // Verificamos que ahora tenga las clases de oculto
        expect(dropdownContainer).toHaveClass("opacity-0");
        expect(dropdownContainer).toHaveClass("pointer-events-none");
    });

    it('debe navegar entre meses al usar las flechas', () => {
        render(<CustomDatePicker value="2025-11-20" onChange={() => {}} />);

        // Abrir calendario
        fireEvent.click(screen.getByText("20/11/2025"));
        expect(screen.getByText("Noviembre 2025")).toBeVisible();

        // Obtener botones
        // Índice 0 = Trigger (Input)
        // Índice 1 = Flecha Izquierda (Mes Anterior)
        // Índice 2 = Flecha Derecha (Mes Siguiente)
        const buttons = screen.getAllByRole('button');
        const prevButton = buttons[1];
        const nextButton = buttons[2];

        //  Ir al mes anterior (Octubre)
        fireEvent.click(prevButton);
        expect(screen.getByText("Octubre 2025")).toBeVisible();

        //  Ir al mes siguiente dos veces (Oct -> Nov -> Dic)
        fireEvent.click(nextButton); // Vuelve a Noviembre
        fireEvent.click(nextButton); // Avanza a Diciembre
        expect(screen.getByText("Diciembre 2025")).toBeVisible();
    });
});