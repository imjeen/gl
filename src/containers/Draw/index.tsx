import React, { useRef } from 'react';

import { useLine, useGrid } from '@/services/hooks/draw';

const WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

export default function Draw() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useGrid(canvasRef);

    useLine(canvasRef, { strokeStyle: 'green', lineJoin: 'round', lineWidth: 5 });

    return (
        <>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
        </>
    );
}
