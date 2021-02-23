import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';

export default function Point() {
    const refCanvas = useCanvas<WebGLRenderingContext>(render);
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

/**
 * 创建 shader
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    // 创建 shader 对象
    let shader = gl.createShader(type);
    if (!shader) return;
    // 往 shader 中传入源代码
    gl.shaderSource(shader, source);
    // 编译 shader
    gl.compileShader(shader);
    // 判断 shader 是否编译成功
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    // 如果编译失败，则打印错误信息
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * 创建 program
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    // 创建 program 对象
    let program = gl.createProgram();
    if (!program) return;
    // 往 program 对象中传入 WebGLShader 对象
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接 program
    gl.linkProgram(program);
    // 判断 program 是否链接成功
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    // 如果 program 链接失败，则打印错误信息
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/**
 * 初始化Shader程序
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexSource
 * @param {string} fragmentSource
 */
function initWebGL(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    // 根据源代码创建顶点着色器
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    // 根据源代码创建片元着色器
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;
    // 创建 WebGL Program 程序
    let program = createProgram(gl, vertexShader, fragmentShader);
    return program;
}

// 顶点着色器
const vertexShader = `
    attribute vec4 a_position;
    void main () {
        // gl_Position 为内置变量，表示当前点的位置
        gl_Position = a_position;
        // gl_PointSize 为内置变量，表示当前点的大小，为浮点类型，如果赋值是整数类型会报错
        gl_PointSize = 100.0;
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
    // 获取shader中a_position的地址
    const a_position = gl.getAttribLocation(program, 'a_position');
    // 往a_position这个地址中传值
    gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0);

    // 开始绘制，绘制类型是gl.POINTS绘制点，0表示第一个点的索引，1表示共绘制几个点
    gl.drawArrays(gl.POINTS, 0, 1);
}
