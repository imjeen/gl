import React, { useRef, useEffect } from 'react';

import styles from './styles.module.less';
import { useCanvas } from '@/services/hooks/canvas';

// 使用自定义 canvas hook
export default function HelloWorld() {
    const refCanvas = useCanvas<WebGLRenderingContext>(gl => {
        gl.clearColor(0, 0, 0, 1); // 使用完全不透明的黑色清除所有图像
        gl.clear(gl.COLOR_BUFFER_BIT); // 用上面指定的颜色清除缓冲区
    });

    return (
        <>
            <canvas ref={refCanvas} width="750" height="1000" className={styles.canvas} />
        </>
    );
}

// 普通使用方式
export function HelloWorld2() {
    const refCanvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = refCanvas.current;
        const gl = canvas?.getContext('webgl');
        if (gl) {
            gl.clearColor(0, 0, 0, 1); // 使用完全不透明的黑色清除所有图像
            gl.clear(gl.COLOR_BUFFER_BIT); // 用上面指定的颜色清除缓冲区
        }
    });

    return (
        <>
            <canvas ref={refCanvas} width="750" height="1000" className={styles.canvas} />
        </>
    );
}
