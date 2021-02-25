import React from 'react';

import { useCanvas } from '@/services/hooks/canvas';
import { useImage } from '@/services/hooks/image';
import { initWebGL } from '@/utils/gl';

export default function ImageTexture() {
    const image = useImage(`https://elements.stoumann.dk/assets/img/filter01.jpg`);
    const refCanvas = useCanvas<WebGLRenderingContext>(gl => image && render(gl, image));
    return <canvas ref={refCanvas} width="750" height="1000" />;
}

// 顶点着色器
const vertexShader = `
    attribute vec4 a_position; // 通过 js 传递顶点坐标
    attribute vec2 a_texCoord; // 通过 js 传递纹理坐标
    varying vec2 v_texCoord; // 传递纹理坐标给 片元着色器
    void main () {
        gl_Position = a_position;
        gl_PointSize = 10.0;
        v_texCoord = a_texCoord;
    }  
`;
// 片元着色器
const fragmentShader = `
    precision mediump float;
    varying vec2 v_texCoord; // 接受顶点着色器传来的纹理坐标
    uniform sampler2D u_texture; // 声明一个uniform变量来保存纹理
    void main () {
        gl_FragColor = texture2D(u_texture, v_texCoord); // 使用内建的texture2D函数进行采样，获取纹素颜色
    }
`;

async function render(gl: WebGLRenderingContext, image: HTMLImageElement) {
    // 初始化shader程序
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) return;
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program);

    /* prettier-ignore */
    const points = [
        -1, 1,
        1, 1,
        -1, -1,
        1, 1,
        -1, -1,
        1, -1
    ];
    /* prettier-ignore */
    const texCoords = [
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        0, 0,
        1, 0
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    // 获取shader中 a_position 的地址
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_position);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    // 获取shader中 a_texCoord 的地址
    const a_texCoord = gl.getAttribLocation(program, 'a_texCoord');
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(a_texCoord);

    // 纹理缓存
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // 反转 Y 轴进行:纹理图片与canvas坐标 Y 轴相反
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
