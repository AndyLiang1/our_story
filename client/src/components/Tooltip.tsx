import * as React from 'react';
import { cloneElement, useState } from 'react';

export interface ITooltipProps {
    children: React.ReactElement;
}

export function Tooltip({ children }: ITooltipProps) {
    const [hover, setHover] = useState(false);
    const handleHover = () => {
        setHover(true);
    };

    const handleLeave = () => {
        setHover(false);
    };

    const handleClick = () => {};

    const childWithProps = cloneElement(children, {
        onMouseEnter: handleHover,
        onMouseLeave: handleLeave
        // handleClick: handleClick
    });

    return (
        <div className="group inline-block">
            {childWithProps}
            {/* <div className="absolute bottom-[130%] z-10 min-h-[20px] 
            min-w-[20px] rounded 
            bg-blue-500 p-1 text-white transition group-hover:visible group-hover:opacity-100">
                Hello
            </div> */}
            <span className="absolute bottom-[130%] mb-2 w-[2px] rounded bg-blue-500 p-1 text-white transition group-hover:visible group-hover:opacity-100">
                    This is inside the tooltip.
                </span>
        </div>
    );
}
