import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';

export default function TriangleBase() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

// 顶点着色器
const vertexShader = `
    attribute vec4 a_position;
    void main () {
        // gl_Position 为内置变量，表示当前点的位置
        gl_Position = a_position;
        // gl_PointSize 为内置变量，表示当前点的大小，为浮点类型，如果赋值是整数类型会报错
        gl_PointSize = 10.0;
    }  
`;
// 片元着色器
const fragmentShader = `
    // 设置浮点数精度
    precision mediump float;
    void main () {
        // vec4 是表示四维向量，这里用来表示RGBA的值[0~1]，均为浮点数，如为整数则会报错
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function render(gl: WebGLRenderingContext) {
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program);

    /* prettier-ignore */
    const points = [
        -0.5, 0.0, 
        0.5, 0.0, 
        0.0, 0.5,
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    // 获取shader中a_position的地址
    const a_position = gl.getAttribLocation(program, 'a_position');

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
