import { useRef, useEffect } from 'react';

export function useCanvas<T = RenderingContext>(drawCallback: (ctx: T) => void, context: '2d' | 'webgl' = 'webgl') {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = (canvas?.getContext(context) as unknown) as T;
        if (!ctx) return;

        let rafId = 0;
        const renderFrame = function () {
            rafId = requestAnimationFrame(renderFrame);
            drawCallback(ctx);
        };
        requestAnimationFrame(renderFrame);
        return () => cancelAnimationFrame(rafId);
    }, [drawCallback, context]);

    return canvasRef;
}
