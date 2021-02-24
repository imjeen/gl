import React from 'react';

import { initWebGL } from '@/utils/gl';
import { useCanvas } from '@/services/hooks/canvas';

export default function MultipleTriangle() {
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
    precision mediump float;  // 设置浮点数精度
    void main () {
        // vec4 是表示四维向量，这里用来表示RGBA的值[0~1]，均为浮点数，如为整数则会报错
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function render(gl: WebGLRenderingContext) {
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    const draw = (points: number[]) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

        const a_position = gl.getAttribLocation(program, 'a_position');

        gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
        gl.enableVertexAttribArray(a_position);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* prettier-ignore */
    const points = [
       -1, 1,
       0, 1,
       -1, -1,

    //    1, 1,
    //    0, -1,
    //    1, -1
    ];
    draw(points);

    // 绘制另一个三角形
    /* prettier-ignore */
    const anotherPoints = [
        1, 1,
        0, -1,
        1, -1
     ];
    draw(anotherPoints);
}
