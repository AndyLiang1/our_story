import * as React from 'react';

export interface IToolTipHoverTextProps {
    content: string;
}

export function ToolTipHoverText({ content }: IToolTipHoverTextProps) {
    return (
        <div className="flex h-[1.5rem] items-center justify-center bg-yellow-300 text-center pl-1 pr-1 rounded-[0.5rem] text-[0.75rem]">
            {content}
        </div>
    );
}
