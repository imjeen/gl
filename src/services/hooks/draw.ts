import React, { useState, useEffect, useCallback } from 'react';

type Coordinate = {
    x: number;
    y: number;
};

/**
 * 画线条
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef - canvas 引用
 * @param {({
 *         strokeStyle: string | CanvasGradient | CanvasPattern;
 *         lineJoin: CanvasLineJoin;
 *         lineWidth: number;
 *     })} [options={
 *         strokeStyle: 'red',
 *         lineJoin: 'round',
 *         lineWidth: 5,
 *     }] - 线条格式选项
 */
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
        (event: MouseEvent | TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const { clientX, clientY } = (event as TouchEvent).changedTouches
                ? (event as TouchEvent).changedTouches[0] // use first touch
                : (event as MouseEvent);
            // const { clientX, clientY } = event as MouseEvent;
            const { offsetLeft, offsetTop } = canvas;
            
            return { x: clientX - offsetLeft, y: clientY - offsetTop };
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

    const handleStart = useCallback(
        (event: MouseEvent | TouchEvent) => {
            event.preventDefault();
            setIsPainting(true);
            const coordinates = getCoordinates(event);
            if (!coordinates) return;
            setMousePosition(coordinates);
        },
        [getCoordinates],
    );

    const handleMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            event.preventDefault();
            if (!isPainting || !mousePosition) return;

            const newCoordinates = getCoordinates(event);
            if (!newCoordinates) return;
            // Drawing
            drawLine(mousePosition, newCoordinates);
            setMousePosition(newCoordinates);
        },
        [drawLine, getCoordinates, isPainting, mousePosition],
    );
    const handleEnd = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;

        el.addEventListener('mousedown', handleStart);
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseup', handleEnd);
        el.addEventListener('mouseleave', handleEnd);

        // add touch events
        el.addEventListener('touchstart', handleStart);
        el.addEventListener('touchmove', handleMove);
        el.addEventListener('touchend', handleEnd);
        el.addEventListener('touchcancel', handleEnd);

        return () => {
            el.removeEventListener('mousedown', handleStart);
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseup', handleEnd);
            el.removeEventListener('mouseleave', handleEnd);
            // remove touch events
            el.removeEventListener('touchstart', handleStart);
            el.removeEventListener('touchmove', handleMove);
            el.removeEventListener('touchend', handleEnd);
            el.removeEventListener('touchcancel', handleEnd);
        };
    }, [canvasRef, handleEnd, handleStart, handleMove]);
}
