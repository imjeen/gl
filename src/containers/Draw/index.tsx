import React, { useRef } from 'react';

import { useLine } from '@/services/hooks/draw';

export default function Draw() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLine(canvasRef, { strokeStyle: 'green', lineJoin: 'round', lineWidth: 5 });

    return (
        <>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
        </>
    );
}
