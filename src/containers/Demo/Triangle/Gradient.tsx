import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';

export default function TriangleColor() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

function render(gl: WebGLRenderingContext) {
    render1(gl);
    render2(gl);
}

function render1(gl: WebGLRenderingContext) {
    // 顶点着色器
    const vertexShader = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        varying vec4 v_color; // 传递给 片元着色器
        void main () {
            gl_Position = a_position;
            v_color = a_color;
        }  
    `;
    // 片元着色器
    const fragmentShader = `
        precision mediump float;  // 设置浮点数精度
        varying vec4 v_color; 
        void main () {
            gl_FragColor = v_color;
        }
    `;
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program);

    /* prettier-ignore */
    const points = [
        0.25, 0.0,  0.0, 0.0, 1.0, 1.0, // 顶点位置 + 颜色（RGBA）
        1.0, 0.0,   0.0, 0.0, 1.0, 1.0,
        0.0, 1.0,   0.0, 0.0, 1.0, 1.0,
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    // 顶点位置
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 6, 0);
    gl.enableVertexAttribArray(a_position);

    // 顶点颜色
    const a_color = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(
        a_color,
        4,
        gl.FLOAT,
        false,
        Float32Array.BYTES_PER_ELEMENT * 6,
        Float32Array.BYTES_PER_ELEMENT * 2,
    );
    gl.enableVertexAttribArray(a_color);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function render2(gl: WebGLRenderingContext) {
    // 两个着色器：
    // 需要a_color这个变量进行插值处理。
    // 在片元着色器中必须定义一个相同名称的变量，这样在片元着色器中就可以直接使用插值后的值了。

    // 顶点着色器
    const vertexShader = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        varying vec4 v_color; // 传递给 片元着色器
        void main () {
            gl_Position = a_position;
            v_color = a_color;
        }  
    `;
    // 片元着色器
    const fragmentShader = `
        precision mediump float;  // 设置浮点数精度
        varying vec4 v_color; 
        void main () {
            gl_FragColor = v_color;
        }
    `;
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program);

    /* prettier-ignore */
    const points = [
        -1.0, 0.0, 
        0.0, 0.0, 
        0.0, 0.5,
    ];
    /* prettier-ignore */
    const colors = [
        1.0, 0.0, 0.0, 1.0, 
        0.0, 1.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 1.0
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    // 颜色缓冲
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    const a_color = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, 0);
    gl.enableVertexAttribArray(a_color);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
