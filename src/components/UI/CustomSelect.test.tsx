import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CustomSelect } from './CustomSelect';

const opcionesPrueba = [
    { value: 'opcion1', label: 'Opción 1' },
    { value: 'opcion2', label: 'Opción 2' },
];

describe('Componente: CustomSelect', () => {
    it('debe renderizar el placeholder si no hay valor seleccionado', () => {
        render(
            <CustomSelect
                value=""
                onChange={() => {}}
                options={opcionesPrueba}
                placeholder="Seleccione algo"
            />
        );

        expect(screen.getByText("Seleccione algo")).toBeInTheDocument();
    });

    it('debe mostrar las opciones al hacer clic y permitir seleccionar', () => {
        const handleChange = vi.fn();

        render(
            <CustomSelect
                value=""
                onChange={handleChange}
                options={opcionesPrueba}
            />
        );

        // Abrir dropdown
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        //  Verificar que las opciones están ahí
        expect(screen.getByText("Opción 1")).toBeInTheDocument();
        expect(screen.getByText("Opción 2")).toBeInTheDocument();

        //  Seleccionar la Opción 2
        fireEvent.click(screen.getByText("Opción 2"));

        // Verificar llamada
        expect(handleChange).toHaveBeenCalledWith("opcion2");
    });

    it('debe cerrarse al hacer clic fuera del componente', () => {
        render(
            <CustomSelect
                value=""
                onChange={() => {}}
                options={opcionesPrueba}
            />
        );

        //  Abrir el select
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const opcion = screen.getByText("Opción 1");
        const dropdownContainer = opcion.closest('.absolute');

        expect(dropdownContainer).toHaveClass("opacity-100");

        //  Simular clic fuera
        fireEvent.mouseDown(document.body);

        // Verificamos clases de cierre en lugar de visibilidad visual
        expect(dropdownContainer).toHaveClass("opacity-0");
        expect(dropdownContainer).toHaveClass("pointer-events-none");
    });
});