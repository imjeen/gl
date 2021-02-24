import React, { useState, useEffect, useCallback } from 'react';

type Coordinate = {
    x: number;
    y: number;
};

export function useLine(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    options: {
        strokeStyle: string | CanvasGradient | CanvasPattern;
        lineJoin: CanvasLineJoin;
        lineWidth: number;
    } = {
        strokeStyle: 'red',
        lineJoin: 'round',
        lineWidth: 5,
    },
) {
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate>();

    const getCoordinates = useCallback(
        (event: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const { pageX, pageY } = event;
            const { offsetLeft, offsetTop } = canvas;
            return { x: pageX - offsetLeft, y: pageY - offsetTop };
        },
        [canvasRef],
    );

    const drawLine = useCallback(
        (from: Coordinate, to: Coordinate) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx) return;

            ctx.strokeStyle = options.strokeStyle;
            ctx.lineJoin = options.lineJoin;
            ctx.lineWidth = options.lineWidth;

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.closePath();

            ctx.stroke();
        },
        [canvasRef, options],
    );

    const paintStart = useCallback(
        (event: MouseEvent) => {
            const coordinates = getCoordinates(event);
            if (!coordinates) return;
            setMousePosition(coordinates);
            setIsPainting(true);
        },
        [getCoordinates],
    );

    const painting = useCallback(
        (event: MouseEvent) => {
            if (!isPainting || !mousePosition) return;

            const newCoordinates = getCoordinates(event);
            if (!newCoordinates) return;
            // Drawing
            drawLine(mousePosition, newCoordinates);
            setMousePosition(newCoordinates);
        },
        [drawLine, getCoordinates, isPainting, mousePosition],
    );
    const paintEnd = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;

        el.addEventListener('mousedown', paintStart);
        el.addEventListener('mousemove', painting);
        el.addEventListener('mouseup', paintEnd);
        el.addEventListener('mouseleave', paintEnd);
        return () => {
            el.removeEventListener('mousedown', paintStart);
            el.removeEventListener('mousemove', painting);
            el.removeEventListener('mouseup', paintEnd);
            el.removeEventListener('mouseleave', paintEnd);
        };
    }, [canvasRef, paintEnd, paintStart, painting]);
}
