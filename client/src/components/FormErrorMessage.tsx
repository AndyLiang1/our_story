export interface IFormErrorMessageProps {
    errorMessage: string;
}

export function FormErrorMessage({ errorMessage }: IFormErrorMessageProps) {
    return (
        <div className="mt-4 flex h-[2rem] w-[90%] items-center justify-center rounded-[3rem] bg-red-200 text-center text-base text-red-600">
            {errorMessage}
        </div>
    );
}
