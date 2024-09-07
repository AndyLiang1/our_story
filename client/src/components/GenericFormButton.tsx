export interface IGenericFormButtonProps {
    displayMessage: string;
    onClick?: any;
    onSubmit?: any;
    type?: 'submit' | 'reset' | 'button' | undefined;
    disabled: boolean;
}

export function GenericFormButton({
    displayMessage,
    onClick,
    onSubmit,
    type
}: IGenericFormButtonProps) {
    return (
        <button
            onClick={onClick}
            onSubmit={onSubmit}
            type={type ? type : undefined}
            className="mt-4 flex h-12 w-[30%] items-center justify-center rounded-[3rem] bg-black text-center text-base font-bold text-white"
        >
            {displayMessage}
        </button>
    );
}
