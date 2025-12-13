import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImageModal from './ImageModal';

describe('Componente: ImageModal', () => {
    it('no debe renderizar nada si isOpen es false o no hay URL', () => {
        const { container } = render(
            <ImageModal isOpen={false} onClose={() => {}} imageUrl="test.jpg" />
        );
        expect(container).toBeEmptyDOMElement();

        const { container: container2 } = render(
            <ImageModal isOpen={true} onClose={() => {}} imageUrl="" />
        );
        expect(container2).toBeEmptyDOMElement();
    });

    it('debe renderizar la imagen cuando está abierto', () => {
        render(
            <ImageModal isOpen={true} onClose={() => {}} imageUrl="http://test.com/img.png" />
        );

        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'http://test.com/img.png');
    });

    it('debe llamar a onClose al hacer clic en el botón de cerrar o el fondo', () => {
        const handleClose = vi.fn();
        render(
            <ImageModal isOpen={true} onClose={handleClose} imageUrl="img.png" />
        );

        const closeButtons = screen.getAllByRole('button');
        fireEvent.click(closeButtons[0]);
        expect(handleClose).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('img').parentElement!.parentElement!.parentElement!);
        expect(handleClose).toHaveBeenCalledTimes(2);
    });
});