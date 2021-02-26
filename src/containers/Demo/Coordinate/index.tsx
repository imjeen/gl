import React from 'react';

import TriangleBase from './Triangle';
import Matrix from './Matrix';

export default function Triangle() {
    return (
        <>
            <h2>三角形：使用屏幕像素坐标</h2>
            <TriangleBase />
            <h2>矩阵转化方式：使用屏幕像素坐标</h2>
            <Matrix />
        </>
    );
}
