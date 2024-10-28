export interface IGenericFormButtonProps {
    displayMessage: string;
    onClick?: any;
    type?: 'submit' | 'reset' | 'button' | undefined;
    disabled?: boolean;
    styles?: string;
}

export function GenericFormButton({ displayMessage, onClick, type, styles }: IGenericFormButtonProps) {
    return (
        <button
            onClick={onClick}
            type={type ? type : undefined}
            className={`flex items-center justify-center rounded-[3rem] bg-black p-[1rem] text-center text-base font-bold text-white ${styles}`}
        >
            {displayMessage}
        </button>
    );
}
