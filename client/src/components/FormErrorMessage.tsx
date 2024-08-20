import * as React from 'react';

export interface IFormErrorMessageProps {
    name: string, 
    form: any,
}

export function FormErrorMessage ({name, form: { touched, errors }}: IFormErrorMessageProps) {
  return (
    <div className="h-[4rem] w-full bg-red text-red-500 text-sm mt-1 border rounded-[3rem]">
        {errors[name]}
    </div>
  );
}
