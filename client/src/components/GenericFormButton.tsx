import { AnyARecord } from 'node:dns';
import { ReactNode } from 'react';

export interface IGenericFormButtonProps {
    displayMessage: ReactNode;
    onClick?: any;
    type?: 'submit' | 'reset' | 'button' | undefined;
    disabled?: boolean;
    styles?: string;
    bold?: boolean;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    padding?: string;
}

export function GenericFormButton({
    displayMessage,
    onClick,
    type,
    styles,
    bold = true,
    backgroundColor,
    textColor = 'text-white',
    fontSize,
    padding
}: IGenericFormButtonProps) {
    return (
        <button
            onClick={onClick}
            type={type ? type : undefined}
            className={
                `flex items-center justify-center rounded-[3rem] text-center ${styles} ` +
                (backgroundColor ? backgroundColor : 'bg-[black]') +
                ' ' +
                textColor +
                ' ' +
                (bold ? 'font-bold' : '') + (fontSize ? fontSize : 'text-[1rem]') + ' ' + 
                (padding ? padding : 'p-[1rem]')
            }
        >
            {displayMessage}
        </button>
    );
}
