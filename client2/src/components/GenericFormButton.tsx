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
    rounded?: boolean;
}

export function GenericFormButton({
    displayMessage,
    onClick,
    type,
    styles,
    bold = false,
    backgroundColor,
    textColor = 'text-white',
    fontSize,
    padding,
    rounded = true
}: IGenericFormButtonProps) {
    return (
        <button
            onClick={onClick}
            type={type ? type : undefined}
            className={
                `mt-4 flex items-center justify-center text-center ${styles} ` +
                (rounded ? 'rounded-[3rem]' : '') +
                ' ' +
                (backgroundColor ? backgroundColor : 'bg-[black]') +
                ' ' +
                textColor +
                ' ' +
                (bold ? 'font-bold' : '') +
                (fontSize ? fontSize : ' text-[1rem]') +
                ' ' +
                (padding ? padding : 'p-[1rem]')
            }
        >
            {displayMessage}
        </button>
    );
}
