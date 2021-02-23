import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { initWebGL } from '@/utils/gl';

export default function Point() {
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
