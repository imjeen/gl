import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';
import { m3 } from '@/utils/matrix';

export default function MatrixCoordinate() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

function render(gl: WebGLRenderingContext) {
    // 顶点着色器
    const vertexShader = `
        attribute vec2 a_position;
        uniform mat3 u_matrix;
        void main () {
            gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        }  
    `;
    // 片元着色器
    const fragmentShader = `
        precision mediump float; // 设置浮点数精度
        uniform vec4 u_color; // 通过全局变量接收自定义颜色
        void main () {
            gl_FragColor = u_color;
        }
    `;

    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    /* prettier-ignore */
    const points = [
        0, 400,
        750, 0,
        750, 1000,
    ]; // 屏幕像素坐标

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    // 颜色
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(colorUniformLocation, 45 / 255, 45 / 255, 170 / 255, 1);

    // 矩阵
    var translation = [0, 0],
        angleInRadians = 0,
        scale = [1, 1];
    const translationMatrix = m3.translation(translation[0], translation[1]);
    const rotationMatrix = m3.rotation(angleInRadians);
    const scaleMatrix = m3.scaling(scale[0], scale[1]);
    // 根据分辨率生成矩阵
    const projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);

    let matrix = m3.identity(); // 初始矩阵
    matrix = m3.multiply(projectionMatrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);

    const u_matrix = gl.getUniformLocation(program, 'u_matrix');
    gl.uniformMatrix3fv(u_matrix, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
