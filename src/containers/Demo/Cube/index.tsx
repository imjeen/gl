import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';

export default function Cube() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

// 顶点着色器
const vertexShader = `
    attribute vec4 a_position;
    void main () {
        gl_Position = a_position;
    }  
`;
// 片元着色器
const fragmentShader = `
    precision mediump float; // 设置浮点数精度
    void main () {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

/**
 * 如下立方体示例图
 *
 *        h ---------- g
 *       /|          / |
 *      / |         /  |
 *    d --|-------- c  |
 *    |   e --------|- f
 *    |  /          |  /
 *    | /           | /
 *    |/            |/
 *    a ----------- b
 *
 */

function render(gl: WebGLRenderingContext) {
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program);

    // TODO
}
