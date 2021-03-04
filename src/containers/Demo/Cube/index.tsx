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
        rotation: [degToRad(50), degToRad(50), degToRad(20)],
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

    // 中心
    matrix = m4.multiply(matrix, m4.translation(-50, -50, 50));

    gl.uniformMatrix4fv(u_matrix, false, matrix);

    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
}

/**
 * 如下立方体示例图
 *
 *        H ---------- G
 *       /|          / |
 *      / |         /  |
 *    D --|-------- C  |
 *    |   E --------|- F
 *    |  /          |  /
 *    | /           | /
 *    |/            |/
 *    A ----------- B
 *
 *  A(0, 0, 0)
 *  B(100, 0, 0)
 *  C(100, 100, 0)
 *  D(0, 100, 0)
 *  E(0, 0, -100)
 *  F(100, 0, -100)
 *  G(100, 100, -100)
 *  H(0, 100, -100)
 */
function set3DModel(gl: WebGLRenderingContext, a_position: number) {
    /* prettier-ignore */
    // 6 个矩形
    const points = [
        // abcd
        0, 0, 0,
        100, 0, 0,
        100, 100, 0,
        100, 100, 0,
        0, 0, 0,
        0, 100, 0,
        // abfe
        0, 0, 0,
        100, 0, 0,
        100, 0, -100,
        100, 0, -100,
        0, 0, 0,
        0, 0, -100,
        // adhe
        0, 0, 0,
        0, 100, 0,
        0, 100, -100,
        0, 0, -100,
        0, 100, -100,
        0, 0, 0,
        //gcdh
        100, 100, -100,
        100, 100, 0,
        0, 100, 0,
        0, 100, -100,
        0, 100, 0,
        100, 100, -100,
        //ghef
        100, 100, -100,
        0, 100, -100,
        0, 0, -100,
        100, 0, -100,
        0, 0, -100,
        100, 100, -100,
        //gcbf
        100, 100, -100,
        100, 100, 0,
        100, 0, 0,
        100, 0, -100,
        100, 0, 0,
        100, 100, -100,
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
    
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

        200,  120, 120,
        200,  120, 120,
        200,  120, 120,
        200,  120, 120,
        200,  120, 120,
        200,  120, 120,

        0,  0, 0,
        0,  0, 0,
        0,  0, 0,
        0,  0, 0,
        0,  0, 0,
        0,  0, 0,

        80, 160, 200,
        80, 160, 200,
        80, 160, 200,
        80, 160, 200,
        80, 160, 200,
        80, 160, 200,

        180, 70, 200,
        180, 70, 200,
        180, 70, 200,
        180, 70, 200,
        180, 70, 200,
        180, 70, 200,

       100,  70, 120,
       100,  70, 120,
       100,  70, 120,
       100,  70, 120,
       100,  70, 120,
       100,  70, 120,

    ];

    // 颜色缓冲
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    gl.enableVertexAttribArray(a_color);
}
