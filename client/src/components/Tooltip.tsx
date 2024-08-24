import Tippy from '@tippyjs/react';
import * as React from 'react';
import { cloneElement, useState } from 'react';
import { ToolTipHoverText } from './ToolTipHoverText';

export interface ITooltipProps {
    children: React.ReactElement;
    tooltipContent: string;
}

export function Tooltip({ children, tooltipContent }: ITooltipProps) {
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

    return <Tippy content={<ToolTipHoverText content={tooltipContent} />}>{childWithProps}</Tippy>;
}
