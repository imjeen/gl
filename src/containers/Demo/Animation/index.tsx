import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';
import { m4 } from '@/utils/matrix';

export default function Translation() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="500" height="500" />;
}

function render(gl: WebGLRenderingContext) {
    // 顶点着色器: 带有坐标转换（屏幕像素坐标 => 裁剪空间坐标）
    const vertexShader = `
     attribute vec4 a_position;
     uniform mat4 u_matrix;
     attribute vec4 a_color;
     varying vec4 v_color;
     void main () {
         gl_Position = u_matrix * a_position;
         
         v_color = a_color; // 将颜色传递给片断着色器
     }  
 `;
    // 片元着色器
    const fragmentShader = `
     precision mediump float; // 设置浮点数精度
     
     varying vec4 v_color; // 从顶点着色器中传入
     void main () {
         gl_FragColor = v_color;
     }
 `;
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 清空画布和深度缓冲
    gl.enable(gl.DEPTH_TEST); //  Enable the depth buffer

    // 位置
    const a_position = gl.getAttribLocation(program, 'a_position');
    set3DModel(gl, a_position);

    // 颜色
    const a_color = gl.getAttribLocation(program, 'a_color');
    setColor(gl, a_color);

    function degToRad(d: number) {
        return (d * Math.PI) / 180;
    }

    // Draw the scene.
    const options = {
        translation: [200, 200, 0],
        rotation: [degToRad(40), degToRad(30), degToRad(5)],
        scale: [1, 1, 1],
    } as {
        translation: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
    };
    const u_matrix = gl.getUniformLocation(program, 'u_matrix');

    let then = 0,
        rafId = 0;
    const draw = function draw(now: number) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        options.rotation[1] += 1.2 * deltaTime;

        drawMatrix(gl, u_matrix, options);

        rafId = requestAnimationFrame(draw);
    };

    draw(0);

    // TODO :clear for useEffect
    return () => cancelAnimationFrame(rafId);
}

/**
 * 绘制
 *
 * @param {WebGLRenderingContext} gl
 * @return {*}
 */
function drawMatrix(
    gl: WebGLRenderingContext,
    u_matrix: WebGLUniformLocation | null,
    options: {
        translation: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
    } = {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
    },
) {
    const { translation, rotation, scale } = options;
    // 矩阵

    const translationMatrix = m4.translation(translation[0], translation[1], translation[2]);
    const rotationXMatrix = m4.rotationX(rotation[0]);
    const rotationYMatrix = m4.rotationY(rotation[1]);
    const rotationZMatrix = m4.rotationZ(rotation[2]);
    const scaleMatrix = m4.scaling(scale[0], scale[1], scale[2]);
    // 根据分辨率生成矩阵
    const projectionMatrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);

    let matrix = m4.identity(); // 初始矩阵
    matrix = m4.multiply(projectionMatrix, translationMatrix);
    matrix = m4.multiply(matrix, rotationXMatrix);
    matrix = m4.multiply(matrix, rotationYMatrix);
    matrix = m4.multiply(matrix, rotationZMatrix);
    matrix = m4.multiply(matrix, scaleMatrix);
    // F 的中心
    matrix = m4.multiply(matrix, m4.translation(-50, -75, -15));

    gl.uniformMatrix4fv(u_matrix, false, matrix);

    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
}

function set3DModel(gl: WebGLRenderingContext, a_position: number) {
    /* prettier-ignore */
    // 16 个矩形
    const points = [
        // left column front
        0,   0,  0,
        0, 150,  0,
        30,   0,  0,
        0, 150,  0,
        30, 150,  0,
        30,   0,  0,

        // top rung front
        30,   0,  0,
        30,  30,  0,
        100,   0,  0,
        30,  30,  0,
        100,  30,  0,
        100,   0,  0,

        // middle rung front
        30,  60,  0,
        30,  90,  0,
        67,  60,  0,
        30,  90,  0,
        67,  90,  0,
        67,  60,  0,

        // left column back
        0,   0,  30,
        30,   0,  30,
        0, 150,  30,
        0, 150,  30,
        30,   0,  30,
        30, 150,  30,

        // top rung back
        30,   0,  30,
        100,   0,  30,
        30,  30,  30,
        30,  30,  30,
        100,   0,  30,
        100,  30,  30,

        // middle rung back
        30,  60,  30,
        67,  60,  30,
        30,  90,  30,
        30,  90,  30,
        67,  60,  30,
        67,  90,  30,

        // top
        0,   0,   0,
        100,   0,   0,
        100,   0,  30,
        0,   0,   0,
        100,   0,  30,
        0,   0,  30,

        // top rung right
        100,   0,   0,
        100,  30,   0,
        100,  30,  30,
        100,   0,   0,
        100,  30,  30,
        100,   0,  30,

        // under top rung
        30,   30,   0,
        30,   30,  30,
        100,  30,  30,
        30,   30,   0,
        100,  30,  30,
        100,  30,   0,

        // between top rung and middle
        30,   30,   0,
        30,   60,  30,
        30,   30,  30,
        30,   30,   0,
        30,   60,   0,
        30,   60,  30,

        // top of middle rung
        30,   60,   0,
        67,   60,  30,
        30,   60,  30,
        30,   60,   0,
        67,   60,   0,
        67,   60,  30,

        // right of middle rung
        67,   60,   0,
        67,   90,  30,
        67,   60,  30,
        67,   60,   0,
        67,   90,   0,
        67,   90,  30,

        // bottom of middle rung.
        30,   90,   0,
        30,   90,  30,
        67,   90,  30,
        30,   90,   0,
        67,   90,  30,
        67,   90,   0,

        // right of bottom
        30,   90,   0,
        30,  150,  30,
        30,   90,  30,
        30,   90,   0,
        30,  150,   0,
        30,  150,  30,

        // bottom
        0,   150,   0,
        0,   150,  30,
        30,  150,  30,
        0,   150,   0,
        30,  150,  30,
        30,  150,   0,

        // left side
        0,   0,   0,
        0,   0,  30,
        0, 150,  30,
        0,   0,   0,
        0, 150,  30,
        0, 150,   0
    ];

    // 缓冲
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
}

function setColor(gl: WebGLRenderingContext, a_color: number) {
    /* prettier-ignore */
    // 颜色
    const colors = [
        // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

        // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

        // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

        // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

        // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

        // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

        // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

        // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

        // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

        // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220
    ];

    // 颜色缓冲
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    gl.enableVertexAttribArray(a_color);
}
