import React from 'react';

import PureTriangle from './Pure';
import GradientTriangle from './Gradient';
import MultipleTriangle from './Multiple';


export default function Triangle() {
    return (
        <>
            <h2>纯色的三角形</h2>
            <PureTriangle />
            <h2>渐变颜色的三角形</h2>
            <GradientTriangle />
            <h2>多种的三角形</h2>
            <MultipleTriangle />
        </>
    );
}
