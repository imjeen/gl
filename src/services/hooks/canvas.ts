import { useRef, useEffect } from 'react';

export function useCanvas<T = RenderingContext>(drawCallback: (ctx: T) => void, context: '2d' | 'webgl' = 'webgl') {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = (canvas?.getContext(context) as unknown) as T;
        if (!ctx) return;

        return drawCallback(ctx);
    }, [context, drawCallback]);

    return canvasRef;
}
