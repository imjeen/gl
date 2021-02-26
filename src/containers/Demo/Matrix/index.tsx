import React from 'react';

import Translation from './Translation';
import Rotation from './Rotation';
import Scaling from './Scale';
import Matrix from "./Matrix";

export default function Texture() {
    return (
        <>
            <h2>平移</h2>
            <Translation />
            <h2>平移+旋转</h2>
            <Rotation />
            <h2>平移+旋转+缩放</h2>
            <Scaling />
            <h2>矩阵</h2>
            <Matrix />
        </>
    );
}
