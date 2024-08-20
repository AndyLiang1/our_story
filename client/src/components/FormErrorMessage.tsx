import * as React from 'react';

export interface IFormErrorMessageProps {
    errorMessage: string;
}

export function FormErrorMessage({ errorMessage }: IFormErrorMessageProps) {
    return (
        <div className="mt-4 h-[2rem] w-[90%] rounded-[3rem]  bg-red-200 flex justify-center text-center items-center text-base text-red-600">
            {errorMessage}
        </div>
    );
}
