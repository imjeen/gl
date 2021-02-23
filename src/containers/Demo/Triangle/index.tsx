import React from 'react';

import PureTriangle from './Pure';
import GradientTriangle from './Gradient';

export default function Triangle() {
    return (
        <>
            <h2>纯色的三角形</h2>
            <PureTriangle />
            <h2>渐变颜色的三角形</h2>
            <GradientTriangle />
        </>
    );
}
