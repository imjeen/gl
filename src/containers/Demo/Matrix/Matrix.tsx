import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';
import { m3 } from '@/utils/matrix';

export default function Translation() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="1000" height="1000" />;
}

function render(gl: WebGLRenderingContext) {
    drawNormalF(gl);
    drawTranslateF(gl);
}

/**
 * 绘制正常的F
 *
 * @param {WebGLRenderingContext} gl
 * @return {*}
 */
function drawNormalF(gl: WebGLRenderingContext) {
    // 顶点着色器: 带有坐标转换（屏幕像素坐标 => 裁剪空间坐标）
    const vertexShader = `
        attribute vec2 a_position;
        uniform vec2 u_resolution; // 设置全局变量：画布的分辨率
        void main () {
            vec2 clipSpace =  (a_position / u_resolution) * 2.0 - 1.0;
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
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 分辨率
    const u_resolution = gl.getUniformLocation(program, 'u_resolution'); // 画布的分辨率变量的地址
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height); // 设置全局变量 分辨率
    // 颜色
    const u_color = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(u_color, 45 / 255, 45 / 255, 170 / 255, 1);

    /* prettier-ignore */
    const points = [
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,
        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,
        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
    ];
    // 缓冲
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    // 位置
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);
    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, 18);
}

function drawTranslateF(gl: WebGLRenderingContext) {
    // 顶点着色器: 带有坐标转换（屏幕像素坐标 => 裁剪空间坐标）
    const vertexShader = `
        attribute vec2 a_position;
        uniform vec2 u_resolution; // 设置全局变量：接收自定义画布的分辨率
        uniform mat3 u_matrix; // 设置全局变量：接收自定义公矩阵
        void main () {
            vec2 position = (u_matrix * vec3(a_position, 1)).xy; // 将位置乘以矩阵

            vec2 clipSpace =  (position / u_resolution) * 2.0 - 1.0;
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
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 分辨率
    const u_resolution = gl.getUniformLocation(program, 'u_resolution'); // 画布的分辨率变量的地址
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height); // 设置全局变量 分辨率
    // 颜色
    const u_color = gl.getUniformLocation(program, 'u_color');
    // gl.uniform4f(u_color, 45 / 255, 45 / 255, 170 / 255, 1);
    gl.uniform4fv(u_color, [Math.random(), Math.random(), Math.random(), 1]);

    /* prettier-ignore */
    const points = [
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,
        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,
        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
    ];
    // 缓冲
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    // 位置
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    //------------------------------------------
    // 平移F
    (() => {
        const translation = [500, 150],
            angle = 0,
            scale = [1, 1];
        // 计算矩阵
        const translationMatrix = m3.translation(translation[0], translation[1]),
            rotationMatrix = m3.rotation(angle),
            scaleMatrix = m3.scaling(scale[0], scale[1]);
        // 矩阵相乘
        let matrix = m3.multiply(translationMatrix, rotationMatrix);
        matrix = m3.multiply(matrix, scaleMatrix);
        // 设置矩阵
        const u_matrix = gl.getUniformLocation(program, 'u_matrix');
        gl.uniformMatrix3fv(u_matrix, false, matrix);

        // 绘制
        gl.drawArrays(gl.TRIANGLES, 0, 18);
    })();

    //------------------------------------------
    // 多次平移F
    (() => {
        const translation = [100, 150],
            angle = 0,
            scale = [1, 1];
        // 计算矩阵
        const translationMatrix = m3.translation(translation[0], translation[1]),
            rotationMatrix = m3.rotation(angle),
            scaleMatrix = m3.scaling(scale[0], scale[1]);

        let matrix = m3.identity(); // 初始矩阵

        const u_matrix = gl.getUniformLocation(program as WebGLProgram, 'u_matrix');
        for (let i = 0; i < 4; i++) {
            matrix = m3.multiply(matrix, translationMatrix);
            matrix = m3.multiply(matrix, rotationMatrix);
            matrix = m3.multiply(matrix, scaleMatrix);
            // 设置颜色
            gl.uniform4fv(u_color, [Math.random(), Math.random(), Math.random(), 1]);
            // 设置矩阵
            gl.uniformMatrix3fv(u_matrix, false, matrix);
            // 绘制
            gl.drawArrays(gl.TRIANGLES, 0, 18);
        }
    })();
}
