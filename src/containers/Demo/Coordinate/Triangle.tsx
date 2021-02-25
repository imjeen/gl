import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';

export default function TriangleBase() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

function render(gl: WebGLRenderingContext) {
    drawByCanvasCoordinate(gl);
    drawColorTriangle(gl);
    drawGradientColorTriangle(gl);
}

/**
 * 使用屏幕坐标绘制
 *
 * @param {WebGLRenderingContext} gl
 * @return {*}
 */
function drawByCanvasCoordinate(gl: WebGLRenderingContext) {
    // 顶点着色器: 带有坐标转换（屏幕像素坐标 => 裁剪空间坐标）
    const vertexShader = `
        attribute vec2 a_position;
        uniform vec2 u_resolution; // 设置全局变量：画布的分辨率
        void main () {
            vec2 zeroToOne = a_position / u_resolution; // 从像素坐标转换到 0.0 到 1.0
            vec2 zeroToTwo = zeroToOne * 2.0; // 再把 0->1 转换 0->2
            vec2 clipSpace = zeroToTwo - 1.0; // 把 0->2 转换到 -1->+1 (裁剪空间)

            // gl_Position = vec4(clipSpace, 0, 1); // 左下角为原点，翻转Y轴等到以下
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); // 左上角为原点
        }  
    `;
    // 片元着色器
    const fragmentShader = `
        precision mediump float; // 设置浮点数精度
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 分辨率
    const u_resolution = gl.getUniformLocation(program, 'u_resolution'); // 画布的分辨率变量的地址
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height); // 设置全局变量 分辨率

    /* prettier-ignore */
    const points = [
        0, 0,
        0, 200,
        200, 200,
    ]; // 屏幕像素坐标

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/**
 * 绘制渐变颜色的三角形
 *
 * @param {WebGLRenderingContext} gl
 */
function drawGradientColorTriangle(gl: WebGLRenderingContext) {
    // 顶点着色器
    const vertexShader = `
        attribute vec2 a_position;
        uniform vec2 u_resolution; // 设置全局变量：画布的分辨率
        attribute vec4 a_color; // js 传递变量
        varying vec4 v_color; // 传递给 片元着色器
        void main () {
            vec2 zeroToOne = a_position / u_resolution; // 从像素坐标转换到 0.0 到 1.0
            vec2 zeroToTwo = zeroToOne * 2.0; // 再把 0->1 转换 0->2
            vec2 clipSpace = zeroToTwo - 1.0; // 把 0->2 转换到 -1->+1 (裁剪空间)
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); // 左上角为原点

            v_color = a_color;
        }  
    `;
    // 片元着色器
    const fragmentShader = `
        precision mediump float; // 设置浮点数精度
        varying vec4 v_color;  // 顶点着色器传来的值
        void main () {
            gl_FragColor = v_color;
        }
    `;

    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    const u_resolution = gl.getUniformLocation(program, 'u_resolution'); // 画布的分辨率变量的地址
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height); // 设置全局变量 分辨率

    /* prettier-ignore */
    const points = [
        0, 0,
        200, 0,
        200, 200,
    ]; // 屏幕像素坐标

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    /* prettier-ignore */
    const colors = [
        1.0, 0.0, 0.0, 1.0, 
        0.0, 1.0, 0.0, 1.0, 
        0.0, 0.0, 1.0, 1.0
    ];
    // 颜色缓冲
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    const a_color = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, 0);
    gl.enableVertexAttribArray(a_color);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/**
 * 绘制纯颜色的三角形
 *
 * @param {WebGLRenderingContext} gl
 */
function drawColorTriangle(gl: WebGLRenderingContext) {
    // 顶点着色器
    const vertexShader = `
        attribute vec2 a_position;
        uniform vec2 u_resolution; // 设置全局变量：画布的分辨率
        void main () {
            vec2 zeroToOne = a_position / u_resolution; // 从像素坐标转换到 0.0 到 1.0
            vec2 zeroToTwo = zeroToOne * 2.0; // 再把 0->1 转换 0->2
            vec2 clipSpace = zeroToTwo - 1.0; // 把 0->2 转换到 -1->+1 (裁剪空间)
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); // 左上角为原点
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

    const u_resolution = gl.getUniformLocation(program, 'u_resolution'); // 画布的分辨率变量的地址
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height); // 设置全局变量 分辨率

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

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
