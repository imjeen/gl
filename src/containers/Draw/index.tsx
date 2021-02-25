import React, { useRef } from 'react';

import { useLine } from '@/services/hooks/draw';

const WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

export default function Draw() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLine(canvasRef, { strokeStyle: 'green', lineJoin: 'round', lineWidth: 5 });

    return (
        <>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
        </>
    );
}
