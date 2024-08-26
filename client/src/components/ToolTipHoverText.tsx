import * as React from 'react';

export interface IToolTipHoverTextProps {
    content: string;
}

export function ToolTipHoverText({ content }: IToolTipHoverTextProps) {
    return (
        <div className="flex h-[1.5rem] items-center justify-center rounded-[0.5rem] bg-yellow-300 pl-1 pr-1 text-center text-[0.75rem]">
            {content}
        </div>
    );
}
