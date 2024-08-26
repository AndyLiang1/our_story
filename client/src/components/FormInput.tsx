import * as React from 'react';

export interface IFormInputProps {
    field: any;
    form: any;
    label: string;
}

export function FormInput({ field, form: { touched, errors }, label, ...props }: IFormInputProps) {
    return (
        <div
            className={
                (touched[field.name] && errors[field.name] ? 'h-22' : 'h-16') +
                ' mt-4 flex w-[90%] flex-col'
            }
        >
            <div className="relative h-16 w-full">
                <input
                    {...field}
                    {...props}
                    className={
                        'form__input absolute left-0 top-0 h-full w-full rounded-[1rem] border font-bold' +
                        (touched[field.name] && errors[field.name]
                            ? ' border-red-500'
                            : ' border-gray-800') +
                        ' ' +
                        'peer pl-4 pt-5 hover:border hover:border-black focus:border-[3px] focus:border-black focus:outline-none'
                    }
                    placeholder=""
                />
                {/* Note, the following top_x is extremely important in creating a smooth transition. No idea why. */}
                <label className="form__label pointer-events-none absolute left-4 top-5 cursor-text text-base font-bold text-gray-500 transition-all duration-200 ease-in peer-focus:top-[0.4rem] peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-[0.4rem] peer-[:not(:placeholder-shown)]:text-sm">
                    {label}
                </label>
                {/* As of right now, we have no errors for specific fields for this application. */}
            </div>
            {touched[field.name] && errors[field.name] && (
                <div className="m-1 flex h-4 w-full items-center justify-center text-center text-[1rem] text-red-500">
                    {errors[field.name]}
                </div>
            )}
        </div>
    );
}
