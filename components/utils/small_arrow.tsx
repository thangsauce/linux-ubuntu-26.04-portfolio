import React from 'react'

interface SmallArrowProps {
    angle?: string;
    className?: string;
}

export default function SmallArrow(props: SmallArrowProps) {
    let angle = props.angle ? props.angle : "up";
    return (
        <div className={" arrow-custom-" + angle}></div>
    )
}
