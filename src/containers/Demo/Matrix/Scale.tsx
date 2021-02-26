import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';

export default function Scaling() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="1000" height="1000" />;
}

function render(gl: WebGLRenderingContext) {
    drawNormalF(gl);
    drawScalingF(gl);
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

function drawScalingF(gl: WebGLRenderingContext) {
    // 顶点着色器: 带有坐标转换（屏幕像素坐标 => 裁剪空间坐标）
    const vertexShader = `
        attribute vec2 a_position;
        uniform vec2 u_resolution; // 设置全局变量：接收自定义画布的分辨率
        uniform vec2 u_translation; // 设置全局变量：接收自定义的平移
        uniform vec2 u_rotation; // 设置全局变量：接收自定义的旋转角度
        uniform vec2 u_scale; // 设置全局变量：接收自定义的缩放
        void main () {
            // 缩放
            vec2 scaledPosition = a_position * u_scale;
            // 旋转位置
            vec2 rotatedPosition = vec2(
                scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
                scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

            // 加上平移量
            vec2 position = rotatedPosition + u_translation; 

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
        const translation = [400, 400],
            rotation = [-0.5, 1], // -1, 1
            scale = [3, 3];
        const u_translation = gl.getUniformLocation(program, 'u_translation');
        const u_rotation = gl.getUniformLocation(program, 'u_rotation');
        const u_scale = gl.getUniformLocation(program, 'u_scale');

        gl.uniform2fv(u_translation, translation); // 设置平移
        gl.uniform2fv(u_rotation, rotation); // 设置旋转
        gl.uniform2fv(u_scale, scale); // 设置旋转
        gl.drawArrays(gl.TRIANGLES, 0, 18);
    })();
}
